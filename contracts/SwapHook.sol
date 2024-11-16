// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

import {IERC20Minimal} from "v4-core/src/interfaces/external/IERC20Minimal.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary, toBeforeSwapDelta} from "v4-core/src/types/BeforeSwapDelta.sol";

import {Math} from "./libraries/Math.sol";
import {LogExpMath} from "./libraries/LogExpMath.sol";

contract SwapHook is BaseHook {
    using LogExpMath for int256;

    struct HookState {
        int256 totalZct;
        int256 totalAsset;
        int256 totalLiquidity;
        int256 scalarRoot;
        int256 initialAnchor;
        uint256 expiry;
        uint256 lnFeeRateRoot;
        uint256 lastLnImpliedRate;
    }

    using PoolIdLibrary for PoolKey;

    mapping(PoolId id => HookState) internal _pools;

    error AddLiquidityDirectToHook();

    int256 internal constant MINIMUM_LIQUIDITY = 10 ** 3;
    int256 internal constant PERCENTAGE_DECIMALS = 100;
    uint256 internal constant DAY = 86400;
    uint256 internal constant IMPLIED_RATE_TIME = 365 * DAY;
    int256 internal constant MAX_MARKET_PROPORTION = (1e18 * 96) / 100;

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}

    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: false,
                afterInitialize: false,
                beforeAddLiquidity: true, // true
                afterAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: true, // true
                afterSwap: false,
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: true,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    function poolInitialize(
        PoolKey memory key,
        int256 scalarRoot,
        int256 initialAnchor,
        uint80 lnFeeRateRoot,
        uint256 expiry
    ) external {
        PoolId poolId = key.toId();
        HookState storage hs = _pools[poolId];
        hs.scalarRoot = scalarRoot;
        hs.lnFeeRateRoot = lnFeeRateRoot;
        hs.initialAnchor = initialAnchor;
        hs.expiry = expiry;
    }

    function isZct(Currency currency) public pure returns (bool) {
        return true;
    }

    function beforeAddLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        bytes calldata
    ) external override returns (bytes4) {
        revert AddLiquidityDirectToHook();
    }

    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata swapParams,
        bytes calldata
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        PoolId id = key.toId();
        HookState storage hs = _pools[id];
        bool exactInput = swapParams.amountSpecified < 0;
        if (isZct(key.currency0)) {
            if (swapParams.zeroForOne) {
                require(exactInput, "a");
            } else {
                require(!exactInput, "b");
            }
        } else {
            if (swapParams.zeroForOne) {
                require(!exactInput, "c");
            } else {
                require(exactInput, "d");
            }
        }

        (Currency zct, Currency asset) = isZct(key.currency0)
            ? (key.currency0, key.currency1)
            : (key.currency1, key.currency0);
        int256 specifiedAmount = exactInput
            ? -swapParams.amountSpecified
            : swapParams.amountSpecified;
        int256 unspecifiedAmount;
        int256 fee;
        BeforeSwapDelta returnDelta;
        if (exactInput) {
            (unspecifiedAmount, fee) = _swap(
                hs,
                -specifiedAmount,
                block.timestamp
            );
            poolManager.sync(asset);
            IERC20Minimal(Currency.unwrap(asset)).transfer(
                address(poolManager),
                uint256(unspecifiedAmount)
            );
            poolManager.settle();
            poolManager.take(zct, address(this), uint256(specifiedAmount));

            returnDelta = toBeforeSwapDelta(
                int128(specifiedAmount),
                int128(-unspecifiedAmount)
            );
        } else {
            (unspecifiedAmount, fee) = _swap(
                hs,
                specifiedAmount,
                block.timestamp
            );
            poolManager.sync(zct);
            IERC20Minimal(Currency.unwrap(zct)).transfer(
                address(poolManager),
                uint256(specifiedAmount)
            );

            poolManager.settle();
            poolManager.take(asset, address(this), uint256(unspecifiedAmount));

            returnDelta = toBeforeSwapDelta(
                int128(-specifiedAmount),
                int128(unspecifiedAmount)
            );
        }
        return (BaseHook.beforeSwap.selector, returnDelta, 0);
    }

    function addLiquidity(
        PoolKey calldata key,
        uint256 zctAmountDesired,
        uint256 assetAmountDesired
    ) external {
        poolManager.unlock(
            abi.encodeCall(
                this.handleAddLiquidity,
                (key, zctAmountDesired, assetAmountDesired, msg.sender)
            )
        );
    }

    function removeLiquidity(PoolKey calldata key, uint256 amount) external {
        poolManager.unlock(
            abi.encodeCall(
                this.handleRemoveLiquidity,
                (key, amount, msg.sender)
            )
        );
    }

    function handleAddLiquidity(
        PoolKey calldata key,
        uint256 zctAmountDesired,
        uint256 assetAmountDesired,
        address sender
    ) external returns (bytes memory) {
        PoolId id = key.toId();
        HookState storage hs = _pools[id];

        (
            int256 liquidity,
            int256 zctAmount,
            int256 assetAmount
        ) = _addLiquidity(
                hs,
                int256(zctAmountDesired),
                int256(assetAmountDesired),
                block.timestamp
            );
        (Currency zct, Currency asset) = isZct(key.currency0)
            ? (key.currency0, key.currency1)
            : (key.currency1, key.currency0);
        poolManager.sync(zct);
        IERC20Minimal(Currency.unwrap(zct)).transferFrom(
            sender,
            address(poolManager),
            uint256(zctAmount)
        );

        poolManager.settle();
        poolManager.take(zct, address(this), uint256(zctAmount));
        poolManager.sync(asset);
        IERC20Minimal(Currency.unwrap(asset)).transferFrom(
            sender,
            address(poolManager),
            uint256(assetAmount)
        );
        poolManager.settle();
        poolManager.take(asset, address(this), uint256(assetAmount));
    }
    function handleRemoveLiquidity(
        PoolKey calldata key,
        uint256 amount,
        address sender
    ) external returns (bytes memory) {
        PoolId id = key.toId();
        HookState storage hs = _pools[id];
        (int256 zctAmount, int256 assetAmount) = _removeLiquidity(
            hs,
            int256(amount)
        );
        poolManager.take(key.currency0, sender, uint256(zctAmount));
        poolManager.take(key.currency1, sender, uint256(assetAmount));
    }

    // INTERNAL FUNCTIONS

    function _addLiquidity(
        HookState storage state,
        int256 zctAmountDesired,
        int256 assetAmountDesired,
        uint256 blockTime
    )
        internal
        returns (int256 liquidity, int256 zctAmount, int256 assetAmount)
    {
        liquidity;
        if (state.totalLiquidity == 0) {
            liquidity =
                int256(
                    Math.sqrt(uint256(assetAmountDesired * zctAmountDesired))
                ) -
                MINIMUM_LIQUIDITY;
            zctAmount = zctAmountDesired;
            assetAmount = assetAmountDesired;
        } else {
            int256 liquidityZct = (zctAmountDesired * state.totalLiquidity) /
                state.totalZct;
            int256 liquidityAsset = (assetAmountDesired *
                state.totalLiquidity) / state.totalAsset;
            if (liquidityZct < liquidityAsset) {
                liquidity = liquidityZct;
                zctAmount = zctAmountDesired;
                assetAmount =
                    (state.totalAsset * liquidity) /
                    state.totalLiquidity;
            } else {
                liquidity = liquidityAsset;
                zctAmount = (state.totalZct * liquidity) / state.totalLiquidity;
                assetAmount = assetAmountDesired;
            }
        }
        require(liquidity > 0 && assetAmount > 0 && zctAmount > 0, "a");
        state.totalAsset += assetAmount;
        state.totalZct += zctAmount;
        state.totalLiquidity += liquidity;
    }

    function _removeLiquidity(
        HookState storage state,
        int256 amount
    ) internal returns (int256 zctAmount, int256 assetAmount) {
        zctAmount = (amount * state.totalZct) / state.totalLiquidity;
        assetAmount = (amount * state.totalAsset) / state.totalLiquidity;
        require(zctAmount != 0 || assetAmount != 0);
        state.totalLiquidity -= amount;
        state.totalAsset -= assetAmount;
        state.totalZct -= zctAmount;
    }

    function _swap(
        HookState storage state,
        int256 amount,
        uint256 blockTime
    ) internal returns (int256 netAssetToAccount, int256 fee) {
        uint256 timeToExpiry = state.expiry - blockTime; // 만기까지 남은 시간
        int256 rateScalar = _getRateScalar(state.scalarRoot, timeToExpiry); // rateScalar 계산
        int256 rateAnchor = _getRateAnchor(
            state.totalZct,
            state.totalAsset,
            rateScalar,
            state.lastLnImpliedRate,
            timeToExpiry
        );
        int256 feeRate = _getExchangeRateFromImpliedRate(
            state.lnFeeRateRoot,
            timeToExpiry
        );
        int256 exchangeRate = _getExchangeRate(
            state.totalZct,
            state.totalAsset,
            rateScalar,
            rateAnchor,
            amount
        );
        int256 assetToAccount = -((amount * 1e18) / exchangeRate);
        // calculate fee
        if (amount > 0) {
            // case of buy zct
            require(((exchangeRate * 1e18) / feeRate) >= 1e18);
            fee = (assetToAccount * (1e18 - feeRate)) / 1e18;
        } else {
            // case of sell zct
            fee = -((assetToAccount * (1e18 - feeRate)) / feeRate);
        }

        netAssetToAccount = assetToAccount - fee;

        state.totalZct = state.totalZct - amount;
        state.totalAsset = state.totalAsset - netAssetToAccount;

        state.lastLnImpliedRate = _getLnImpliedRate(
            state.totalZct,
            state.totalAsset,
            rateScalar,
            rateAnchor,
            timeToExpiry
        );
        require(state.lastLnImpliedRate != 0);
    }

    function _getRateAnchor(
        int256 totalZct,
        int256 totalAsset,
        int256 rateScalar,
        uint256 lastLnImpliedRate,
        uint256 timeToExpiry
    ) internal returns (int256 rateAnchor) {
        int256 newExchangeRate = _getExchangeRateFromImpliedRate(
            lastLnImpliedRate,
            timeToExpiry
        );

        int256 proportion = (totalZct * 1e18) / (totalZct + totalAsset);

        int256 lnProportion = _logProportion(proportion);

        rateAnchor = newExchangeRate - (lnProportion * 1e18) / rateScalar;
    }

    function _getLnImpliedRate(
        int256 totalPt,
        int256 totalAsset,
        int256 rateScalar,
        int256 rateAnchor,
        uint256 timeToExpiry
    ) internal returns (uint256 lnImpliedRate) {
        int256 exchangeRate = _getExchangeRate(
            totalPt,
            totalAsset,
            rateScalar,
            rateAnchor,
            0
        );

        uint256 lnRate = uint256(exchangeRate.ln());
        lnImpliedRate = (lnRate * IMPLIED_RATE_TIME) / timeToExpiry;
    }

    function _getExchangeRateFromImpliedRate(
        uint256 lnImpliedRate,
        uint256 timeToExpiry
    ) internal returns (int256 exchangeRate) {
        uint256 rt = (lnImpliedRate * timeToExpiry) / IMPLIED_RATE_TIME;
        exchangeRate = LogExpMath.exp(int256(rt));
    }

    function _getRateScalar(
        int256 scalarRoot,
        uint256 timeToExpiry
    ) internal returns (int256 rateScalar) {
        rateScalar =
            (scalarRoot * int256(IMPLIED_RATE_TIME)) /
            int256(timeToExpiry);
        require(rateScalar > 0, "rateScalar must be positive");
    }

    function _getExchangeRate(
        int256 totalZct,
        int256 totalAsset,
        int256 rateScalar,
        int256 rateAnchor,
        int256 netZctToAccount
    ) internal returns (int256 exchangeRate) {
        int256 numerator = totalZct - netZctToAccount;
        int256 proportion = ((numerator * 1e18) / (totalZct + totalAsset));
        require(proportion <= MAX_MARKET_PROPORTION);

        int256 lnProportion = _logProportion(proportion);
        exchangeRate = ((lnProportion * 1e18) / rateScalar) + rateAnchor;
        require(exchangeRate >= 1e18);
    }

    function _logProportion(int256 proportion) internal returns (int256 res) {
        require(proportion != 1e18);
        int256 logitP = (proportion * 1e18) / (1e18 - proportion);

        res = logitP.ln();
    }

    function _setInitialLnImpliedRate(
        HookState storage state,
        int256 initialAnchor,
        uint256 blockTime
    ) internal {
        uint256 timeToExpiry = state.expiry - blockTime;
        int256 rateScalar = _getRateScalar(state.scalarRoot, timeToExpiry);
        state.lastLnImpliedRate = _getLnImpliedRate(
            state.totalZct,
            state.totalAsset,
            rateScalar,
            initialAnchor,
            timeToExpiry
        );
    }
}

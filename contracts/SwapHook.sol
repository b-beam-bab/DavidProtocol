// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary, toBeforeSwapDelta} from "v4-core/src/types/BeforeSwapDelta.sol";

import {LogExpMath} from "./libraries/LogExpMath.sol";

contract SwapHook is BaseHook {
    using LogExpMath for int256;

    struct HookState {
        int256 totalZct; // 제로쿠폰본드 양
        int256 totalAsset; // 이더양
        int256 totalLp; // 발행된 lp 토큰양
        int256 scalarRoot;
        uint256 expiry;
        uint256 lnFeeRateRoot;
        uint256 lastLnImpliedRate;
    }

    using PoolIdLibrary for PoolKey;

    mapping(PoolId id => HookState) internal _pools;

    error AddLiquidityDirectToHook();

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
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    function poolInitialize(
        PoolId poolId,
        int256 scalarRoot,
        int256 initialAnchor,
        uint80 lnFeeRateRoot
    ) external {
        HookState storage hs = _pools[poolId];
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
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata swapParams,
        bytes calldata
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        PoolId id = key.toId();
        HookState memory hs = _pools[id];
        bool exactInput = swapParams.amountSpecified < 0;
        (Currency specified, Currency unspecified) = (swapParams.zeroForOne ==
            exactInput)
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
                specified,
                unspecified,
                specifiedAmount,
                block.timestamp
            );
            returnDelta = toBeforeSwapDelta(
                int128(specifiedAmount),
                int128(-unspecifiedAmount)
            );
        } else {
            // TODO FIX IT
            (unspecifiedAmount, fee) = _swap(
                hs,
                specified,
                unspecified,
                specifiedAmount,
                block.timestamp
            );
            returnDelta = toBeforeSwapDelta(
                int128(-specifiedAmount),
                int128(unspecifiedAmount)
            );
        }
        return (BaseHook.beforeSwap.selector, returnDelta, 0);
    }

    function _swap(
        HookState memory state,
        Currency specified,
        Currency unspectified,
        int256 amount,
        uint256 blockTime
    ) internal pure returns (int256 netAssetToAccount, int256 fee) {
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
        ); // 거래전 교환비율 계산

        int256 assetToAccount = -((amount * 1e18) / exchangeRate); // ETH 이동량
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

    ///////////////////////////////// 이자율

    // 기준 이자율 설정해주는 함수
    // 새로운 교환 비율 계산
    function _getRateAnchor(
        int256 totalZct,
        int256 totalAsset,
        int256 rateScalar,
        uint256 lastLnImpliedRate, // 이전 이자율
        uint256 timeToExpiry
    ) internal pure returns (int256 rateAnchor) {
        int256 newExchangeRate = _getExchangeRateFromImpliedRate(
            lastLnImpliedRate,
            timeToExpiry
        );

        int256 proportion = (totalZct * 1e18) / (totalZct + totalAsset);

        int256 lnProportion = _logProportion(proportion);

        rateAnchor = newExchangeRate - (lnProportion * 1e18) / rateScalar;
    }

    // 암묵적 이자율을 계산해주는 함수
    // 현재 교환 비율 계산:
    //      PT와 자산의 비율, rateScalar, 그리고 rateAnchor를 사용해 현재 교환 비율(exchangeRate)을 계산합니다.
    //      만약 교환 비율이 1보다 작다면 에러를 발생시킵니다.

    // 로그 값을 사용해 이자율 계산:
    //      교환 비율의 로그 값(lnRate)을 계산하고, 이를 남은 시간(timeToExpiry)을 고려하여 연간 암묵적 이자율(lnImpliedRate)로 변환합니다.

    function _getLnImpliedRate(
        int256 totalPt,
        int256 totalAsset,
        int256 rateScalar,
        int256 rateAnchor,
        uint256 timeToExpiry
    ) internal pure returns (uint256 lnImpliedRate) {
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

    /// @notice Converts an implied rate to an exchange rate given a time to expiry. The
    /// formula is E = e^rt
    function _getExchangeRateFromImpliedRate(
        uint256 lnImpliedRate,
        uint256 timeToExpiry
    ) internal pure returns (int256 exchangeRate) {
        uint256 rt = (lnImpliedRate * timeToExpiry) / IMPLIED_RATE_TIME;
        exchangeRate = LogExpMath.exp(int256(rt));
    }

    /////////////////////////////////////////////// SCALAR
    function _getRateScalar(
        int256 scalarRoot,
        uint256 timeToExpiry
    ) internal pure returns (int256 rateScalar) {
        rateScalar =
            (scalarRoot * int256(IMPLIED_RATE_TIME)) /
            int256(timeToExpiry);
        require(rateScalar > 0, "rateScalar must be positive");
    }

    //     ///////////////////////
    // totalZct: 시장에 있는 총 PT 수량.
    // totalAsset: 시장에 있는 총 자산 수량.
    // rateScalar: 시장의 민감도를 조정하는 변수.
    // rateAnchor: 암묵적 이자율의 중심을 조정하는 변수.
    // netZctToAccount: 거래로 인해 시장에서 이동할 PT의 순 양.
    function _getExchangeRate(
        int256 totalZct,
        int256 totalAsset,
        int256 rateScalar,
        int256 rateAnchor,
        int256 netZctToAccount
    ) internal pure returns (int256 exchangeRate) {
        int256 numerator = totalZct - netZctToAccount;

        int256 proportion = ((numerator * 1e18) / (totalZct + totalAsset));

        require(proportion <= MAX_MARKET_PROPORTION);

        int256 lnProportion = _logProportion(proportion);

        exchangeRate = ((lnProportion * 1e18) / rateScalar) + rateAnchor;
        require(exchangeRate >= 1e18);
    }

    function _logProportion(
        int256 proportion
    ) internal pure returns (int256 res) {
        require(proportion != 1e18);
        int256 logitP = (proportion * 1e18) / (1e18 - proportion);

        res = logitP.ln();
    }
}

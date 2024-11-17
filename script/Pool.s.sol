// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {Actions} from "v4-periphery/src/libraries/Actions.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Constants} from "v4-core/src/../test/utils/Constants.sol";

// import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";

import {SwapHook} from "contracts/SwapHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {HookMiner} from "../test/utils/HookMiner.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";

contract Deploy is Script, Config {
    using CurrencyLibrary for Currency;

    /////////////////////////////////////
    // --- Parameters to Configure --- //
    /////////////////////////////////////

    // --- pool configuration --- //
    // fees paid by swappers that accrue to liquidity providers
    uint24 lpFee = 3000; // 0.30%
    int24 tickSpacing = 60;
    bytes ZERO_BYTES = new bytes(0);

    // starting price of the pool, in sqrtPriceX96
    uint160 startingPrice = 79228162514264337593543950336; // floor(sqrt(1) * 2^96)

    // --- liquidity position configuration --- //
    uint256 public token0Amount = 1e18;
    uint256 public token1Amount = 1e18;

    // range of the position
    int24 tickLower = -600; // must be a multiple of tickSpacing
    int24 tickUpper = 600;
    /////////////////////////////////////

    function run() external {
        vm.startBroadcast();
        IPoolManager manager = IPoolManager(
            0x8C4BcBE6b9eF47855f97E675296FA3F6fafa5F1A
        );

        address hook = 0x8fd7be00fb9990016080F2829Cd1Bc4db8820888;
        address zcb = 0xbd9DC29B3167fA6b8138C1038265E5dd10a29B2D;

        PoolKey memory poolKey = PoolKey(
            CurrencyLibrary.ADDRESS_ZERO,
            Currency.wrap(address(zcb)), // zcb1
            3000,
            tickSpacing,
            IHooks(hook)
        );
        manager.initialize(poolKey, Constants.SQRT_PRICE_1_1);

        SwapHook(hook).poolInitialize(
            poolKey,
            600000000000000,
            30,
            1,
            block.timestamp + 90000000,
            zcb
        );
        IERC20(zcb).approve(hook, type(uint256).max);
        IERC20(zcb).approve(
            0x1B1C77B606d13b09C84d1c7394B96b147bC03147,
            type(uint256).max
        );

        IERC20(zcb).transfer(
            0x1B1C77B606d13b09C84d1c7394B96b147bC03147,
            10 ether
        );

        IERC20(zcb).transfer(address(manager), 10 ether);

        IERC20(zcb).transfer(
            0xe49d2815C231826caB58017e214Bed19fE1c2dD4,
            10 ether
        );

        IERC20(zcb).transfer(address(hook), 1 ether);

        SwapHook(hook).add{value: 0.01 ether}(
            poolKey,
            0.01 ether,
            0.01 ether,
            msg.sender
        );

        PoolSwapTest swapRouter = PoolSwapTest(
            0xe49d2815C231826caB58017e214Bed19fE1c2dD4
        );
        IERC20(zcb).approve(address(swapRouter), type(uint256).max);

        // swap some tokens
        bool zeroForOne = false;
        int256 amountSpecified = -0.0001 ether;
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: zeroForOne,
            amountSpecified: amountSpecified,
            sqrtPriceLimitX96: zeroForOne
                ? TickMath.MIN_SQRT_PRICE + 1
                : TickMath.MAX_SQRT_PRICE - 1 // unlimited impact
        });
        PoolSwapTest.TestSettings memory testSettings = PoolSwapTest
            .TestSettings({takeClaims: false, settleUsingBurn: false});
        swapRouter.swap(poolKey, params, testSettings, ZERO_BYTES);
        // console.log("SwapHook address:", address(sh));
        vm.stopBroadcast();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {Script} from "forge-std/Script.sol";

import {IDepositContract} from "../contracts/interfaces/IDepositContract.sol";
import {StakingModuleManager} from "../contracts/StakingModuleManager.sol";
import {ZeroCouponBond} from "../contracts/ZeroCouponBond.sol";

contract DeployZCB is Script {
    IDepositContract depositContract = IDepositContract(address(0));

    uint256 constant DEFAULT_MARGIN_RATIO = 100;
    uint256 constant DEFAULT_ZCB_DURATION = 60;

    uint256 constant SECONDS_PER_QUATER = 7776000;

    function run() public {
        console.log("Deploying contract to chain:", block.chainid);
        console.log("Deployer address:", msg.sender);

        vm.startBroadcast();

        StakingModuleManager stakeModuleManager = new StakingModuleManager(
            depositContract
        );
        console.log(
            "StakingModuleManager contract deployed at:",
            address(stakeModuleManager)
        );

        ZeroCouponBond zeroCouponBond = new ZeroCouponBond(
            stakeModuleManager,
            DEFAULT_MARGIN_RATIO,
            DEFAULT_ZCB_DURATION
        );
        console.log(
            "ZeroCouponBond contract deployed at:",
            address(zeroCouponBond)
        );

        vm.stopBroadcast();
    }
}

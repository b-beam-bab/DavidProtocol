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

    address constant devAddress = 0xbAe279Ba9388842A031Ff22C083d823Ab5c12e04;

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

        ZeroCouponBond zeroCouponBond0 = new ZeroCouponBond(
            stakeModuleManager,
            DEFAULT_MARGIN_RATIO,
            SECONDS_PER_QUATER
        );
        console.log(
            "ZeroCouponBond contract deployed at:",
            address(zeroCouponBond0)
        );

        zeroCouponBond0.fakeMint(address(1), 2386543 ether);
        zeroCouponBond0.fakeMint(devAddress, 100 ether);

        ZeroCouponBond zeroCouponBond1 = new ZeroCouponBond(
            stakeModuleManager,
            DEFAULT_MARGIN_RATIO,
            SECONDS_PER_QUATER * 2
        );
        console.log(
            "ZeroCouponBond contract deployed at:",
            address(zeroCouponBond1)
        );

        zeroCouponBond1.fakeMint(address(1), 1363732 ether);
        zeroCouponBond1.fakeMint(devAddress, 100 ether);

        ZeroCouponBond zeroCouponBond2 = new ZeroCouponBond(
            stakeModuleManager,
            DEFAULT_MARGIN_RATIO,
            SECONDS_PER_QUATER * 3
        );
        console.log(
            "ZeroCouponBond contract deployed at:",
            address(zeroCouponBond2)
        );

        zeroCouponBond2.fakeMint(address(1), 284675 ether);
        zeroCouponBond2.fakeMint(devAddress, 100 ether);

        vm.stopBroadcast();
    }
}

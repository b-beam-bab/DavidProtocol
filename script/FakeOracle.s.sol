// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/console.sol";

import {Script} from "forge-std/Script.sol";

import {FakeOracle} from "../contracts/FakeOracle.sol";

contract DeployZCB is Script {
    uint256 constant FAKE_AVERAGE_YIELD = 3 * 1e18;

    function run() public {
        console.log("Deploying contract to chain:", block.chainid);
        console.log("Deployer address:", msg.sender);

        vm.startBroadcast();

        FakeOracle fakeOracle = new FakeOracle(FAKE_AVERAGE_YIELD);
        console.log("FakeOracle contract deployed at:", address(fakeOracle));

        vm.stopBroadcast();
    }
}

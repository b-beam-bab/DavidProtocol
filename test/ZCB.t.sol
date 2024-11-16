pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";

import {IDepositContract} from "../contracts/interfaces/IDepositContract.sol";
import {StakingModuleManager} from "../contracts/StakingModuleManager.sol";
import {ZeroCouponBond} from "../contracts/ZeroCouponBond.sol";

address constant addr0 = 0x000000000000000000000000000000000000aaaa;

contract ZCBTest is Test {
    StakingModuleManager stakeModuleManager;
    ZeroCouponBond zeroCouponBond;

    function setUp() public {
        IDepositContract depositContract = IDepositContract(address(0));
        stakeModuleManager = new StakingModuleManager(depositContract);
        zeroCouponBond = new ZeroCouponBond(stakeModuleManager, 100, 60);
    }
    function testLeverageStaking() public {
        vm.deal(addr0, 100 ether);

        // 1. Create Staking Module
        stakeModuleManager.stake{value: 1 ether}(
            bytes(""),
            bytes(""),
            bytes32("")
        );
    }
}

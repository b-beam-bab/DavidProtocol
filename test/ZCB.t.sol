pragma solidity ^0.8.26;

import {console} from "forge-std/console.sol";
import {Test} from "forge-std/Test.sol";

import {IDepositContract} from "../contracts/interfaces/IDepositContract.sol";
import {IStakingModule} from "../contracts/interfaces/IStakingModule.sol";

import {StakingModuleManager} from "../contracts/StakingModuleManager.sol";
import {ZeroCouponBond} from "../contracts/ZeroCouponBond.sol";

address constant addr0 = 0x000000000000000000000000000000000000aaaa;
address constant addr1 = 0x000000000000000000000000000000000000BbBB;

contract ZCBTest is Test {
    StakingModuleManager stakingModuleManager;
    ZeroCouponBond zeroCouponBond;

    function setUp() public {
        IDepositContract depositContract = IDepositContract(address(0));
        stakingModuleManager = new StakingModuleManager(depositContract);
        zeroCouponBond = new ZeroCouponBond(stakingModuleManager, 100, 60);
    }
    function testLeverageStaking() public {
        vm.deal(addr0, 100 ether);

        bytes memory pubkey = bytes("");
        bytes memory signature = bytes("");
        bytes32 depositDataRoot = bytes32("");

        // 1. Create Staking Module
        vm.prank(addr0);
        stakingModuleManager.stake{value: 1 ether}(
            pubkey,
            signature,
            depositDataRoot
        );

        vm.prank(addr0);
        address stakingModuleAddr = stakingModuleManager.getStakingModule(
            addr0,
            pubkey
        );
        IStakingModule stakingModule = IStakingModule(stakingModuleAddr);
        console.logAddress(stakingModuleAddr);
        console.logUint(stakingModuleAddr.balance);

        zeroCouponBond.setMaturity(1e5);
        console.logUint(zeroCouponBond.maturity());

        vm.prank(addr0);
        stakingModule.mintBond(zeroCouponBond, 1 ether);

        uint256 balanceOfAddr0 = zeroCouponBond.balanceOf(addr0);
        console.logUint(balanceOfAddr0);

        vm.prank(addr0);
        zeroCouponBond.transfer(addr1, balanceOfAddr0);
        uint256 balanceOfAddr1 = zeroCouponBond.balanceOf(addr1);
        console.logUint(balanceOfAddr1);

        uint256 valueOfBond = (balanceOfAddr1 * 97) / 100;
        console.logUint(addr0.balance);
        vm.deal(addr0, addr0.balance + valueOfBond);
        console.logUint(addr0.balance);
    }

    function testFakeMint() public {
        console.logUint(zeroCouponBond.totalSupply());
        zeroCouponBond.fakeMint(address(1), 100 ether);
        console.logUint(zeroCouponBond.totalSupply());
    }
}

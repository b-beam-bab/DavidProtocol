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

        console.logUint(addr0.balance);
        uint256 amountToIssue = 1 ether;
        uint256 averageDiscount = 45;
        for (uint256 i = 0; i < 10; ++i) {
            amountToIssue = bondCycle(
                addr0,
                addr1,
                amountToIssue,
                averageDiscount
            );
            vm.deal(addr0, addr0.balance + amountToIssue);
            console.logUint(addr0.balance);
        }
    }

    function testFakeMint() public {
        console.logUint(zeroCouponBond.totalSupply());
        zeroCouponBond.fakeMint(address(1), 100 ether);
        console.logUint(zeroCouponBond.totalSupply());
    }

    function bondCycle(
        address issuer,
        address invester,
        uint256 amount,
        uint256 averageDiscount
    ) internal returns (uint256) {
        bytes memory pubkey = bytes("");
        bytes memory signature = bytes("");
        bytes32 depositDataRoot = bytes32("");

        // 1. Create Staking Module
        vm.prank(issuer);
        stakingModuleManager.stake{value: 1 ether}(
            pubkey,
            signature,
            depositDataRoot
        );

        vm.prank(issuer);
        address stakingModuleAddr = stakingModuleManager.getStakingModule(
            issuer,
            pubkey
        );
        IStakingModule stakingModule = IStakingModule(stakingModuleAddr);
        console.logAddress(stakingModuleAddr);
        console.logUint(stakingModuleAddr.balance);

        zeroCouponBond.setMaturity(1e5);
        console.logUint(zeroCouponBond.maturity());

        vm.prank(issuer);
        stakingModule.mintBond(zeroCouponBond, 1 ether);

        uint256 balanceOfIssuer = zeroCouponBond.balanceOf(issuer);
        console.logUint(balanceOfIssuer);

        vm.prank(issuer);
        zeroCouponBond.transfer(addr1, balanceOfIssuer);
        uint256 balanceOfAddr1 = zeroCouponBond.balanceOf(addr1);
        console.logUint(balanceOfAddr1);

        uint256 valueOfBond = (balanceOfAddr1 * (1000 - averageDiscount)) /
            1000;

        return valueOfBond;
    }
}

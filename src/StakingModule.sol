// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./interfaces/IDepositContract.sol";
import "./interfaces/IStakingModuleManager.sol";

contract StakingModule {
    IDepositContract public immutable depositContract;
    IStakingModuleManager public immutable stakingModuleManager;

    uint256 private _balance;

    constructor(
        IDepositContract _depositContract,
        IStakingModuleManager _stakingModuleManager
    ) {
        depositContract = _depositContract;
        stakingModuleManager = _stakingModuleManager;
    }

    modifier onlyStakingModuleManager() {
        require(
            msg.sender == address(stakingModuleManager),
            "StakigModule::onlyStakingModuleManager - Invalid caller"
        );
        _;
    }

    // function stake(
    //     bytes calldata pubkey,
    //     bytes calldata signature,
    //     bytes32 depositDataRoot
    // ) external payable onlyStakingModuleManager {
    //     require(msg.value == 32 ether, "Invalid staking amount");

    //     bytes memory wc = _getWithdrawalCredentials();
    //     depositContract.deposit{value: 32 ether}(
    //         pubkey,
    //         wc,
    //         signature,
    //         depositDataRoot
    //     );
    // }
    function stake(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot
    ) external payable onlyStakingModuleManager {
        // Note
        // 1. Due to issues in the development environment, we adjusted the scale of deposit amounts.
        // 2. We modified the conditions to allow for more flexible deposit amounts, considering the Pectra upgrade.
        require(msg.value > 1 ether, "Invalid staking amount");

        // Note
        // 1. Due to a delay in reflecting the validator’s deposit details, we replace this part to balance update.
        // 2. In the current spec(dencun), additional deposits are meaningless as it will be withdrawed eventually.
        //    However, effective active balance can grows after the pectra update, so the accumulation of balance will become meaningful.
        //    Considering this, the new deposit will be added to the existing balance.
        _balance += msg.value;
    }

    function createWithdrawal() external {}
    function completeWithdrawal() external {}

    function _getWithdrawalCredentials() internal view returns (bytes memory) {
        return abi.encodePacked(bytes1(uint8(1)), bytes11(0), address(this));
    }
}

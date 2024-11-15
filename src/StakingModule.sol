// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./interfaces/IDepositContract";
import "./StakingModuleManager";

contract StakingModule {
    IDepositContract public immutable depositContract;
    IStakingModuleManager public immutable stakingModuleManager;

    constructor(
        IDepositContract _depositContract,
        IStakingModuleManager stakingModuleManager
    ) {
        depositContract = _depositContract;
        stakingModuleManager = _stakingModuleManager;
    }

    modifier onlyStakingModuleManager() {
        require(
            msg.sender == stakingModuleManager,
            "StakigModule::onlyStakingModuleManager - Invalid caller"
        );
    }

    function stake(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot
    ) external payable onlyStakingModuleManager {
        require(msg.value == 32 ether, "Invalid staking amount");

        bytes wc = _getWithdrawalCredentials();
        depositContract.deposit{value: 32 ether}(
            pubkey,
            wc,
            signature,
            depositDataRoot
        );
    }

    function createWithdrawal() {}

    function completeWithdrawal() {}

    function _getWithdrawalCredentials() internal view returns (bytes memory) {
        return abi.encodePacked(bytes1(uint8(1)), bytes11(0), address(this));
    }
}

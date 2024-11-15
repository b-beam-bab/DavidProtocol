// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface StakingModule {
    function stake(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot
    ) external payable;

    function createWithdrawal() {}
    function completeWithdrawal() {}
    function _getWithdrawalCredentials() internal view returns (bytes memory);
}

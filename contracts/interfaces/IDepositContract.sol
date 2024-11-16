// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IDepositContract {
    function deposit(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) external payable;
    function get_deposit_root() external view returns (bytes32);
    function get_deposit_count() external view returns (bytes memory);
}

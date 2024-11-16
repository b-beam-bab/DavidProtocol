// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./IStakingModule.sol";

interface IStakingModuleManager {
    function stake(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot
    ) external payable;

    function getStakingModule(
        address owner,
        bytes calldata pubkey
    ) view returns (address);
}

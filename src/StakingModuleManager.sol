// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Create2.sol";

import "./interfaces/IDepositContract.sol";
import "./interfaces/IStakigModule.sol";

contract StakingModuleManager {
    IDepositContract public immutable depositContract;
    mapping(address => IStakingModule) public stakingModules;

    constructor(IDepositContract _depositContract) {
        depositContract = _depositContract;
    }

    function stake(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot
    ) external payable {
        IStakingModule stakingModule = stakingModules[msg.sender];
        if (address(stakingModule) == address(0)) {
            stakingModule = _createStakingModule();
            stakingModules[msg.sender] = stakingModule;
            stakingModule.stake{value: msg.value}.stake(
                pubkey,
                signature,
                depositDataRoot
            );
        }
    }

    function _createStakingModule() internal returns (IStakingModule) {
        IStakingModule stakingModule = IStakingModule(
            Create2.deploy(
                0,
                bytes32(uint256(uint160(msg.sender))),
                abi.encodePacked(
                    type(IStakingModule).creationCode,
                    abi.encode(depositContract, address(this))
                )
            )
        );
        return stakingModule;
    }

    function createWithdrawal() external {}
    function completeWithdrawal() external {}
}

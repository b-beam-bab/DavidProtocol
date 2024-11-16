// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Create2.sol";

import "./interfaces/IDepositContract.sol";
import "./interfaces/IStakingModuleManager.sol";
import "./interfaces/IStakingModule.sol";

import "./StakingModule.sol";

contract StakingModuleManager is IStakingModuleManager {
    IDepositContract public immutable depositContract;
    mapping(bytes32 => IStakingModule) public stakingModules;

    constructor(IDepositContract _depositContract) {
        depositContract = _depositContract;
    }

    function stake(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot
    ) external payable {
        // Even if the EOA address is the same, cases with different pubkeys are distinguished.
        bytes32 key = _calculateKey(msg.sender, pubkey);
        IStakingModule stakingModule = stakingModules[key];
        if (address(stakingModule) == address(0)) {
            stakingModule = _createStakingModule();
            stakingModules[key] = stakingModule;
        }

        stakingModule.stake{value: msg.value}(
            pubkey,
            signature,
            depositDataRoot
        );
    }

    function getStakingModule(
        address owner,
        bytes calldata pubkey
    ) view returns (address) {
        bytes32 key = _calculateKey(owner, pubkey);

        IStakingModule stakingModule = stakingModules[key];
        return address(stakingModule);
    }

    function _calculateKey(
        address owner,
        bytes calldata pubkey
    ) internal returns (bytes32) {
        bytes32 key = keccak256(abi.encodePacked(msg.sender, pubkey));
        return key;
    }

    function _createStakingModule() internal returns (IStakingModule) {
        IStakingModule stakingModule = IStakingModule(
            Create2.deploy(
                0,
                bytes32(uint256(uint160(msg.sender))),
                abi.encodePacked(
                    type(StakingModule).creationCode,
                    abi.encode(depositContract, address(this))
                )
            )
        );
        return stakingModule;
    }
}

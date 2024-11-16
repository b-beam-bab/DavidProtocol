// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";

import "./interfaces/IDepositContract.sol";
import "./interfaces/IStakingModule.sol";
import "./interfaces/IStakingModuleManager.sol";
import "./interfaces/IZeroCouponBond.sol";

contract StakingModule is IStakingModule {
    IDepositContract public immutable depositContract;
    IStakingModuleManager public immutable stakingModuleManager;
    address public immutable owner;
    uint256 private _totalBalance;
    uint256 private _totalLockedBalance;
    mapping(address => uint256) private _lockedBalances;
    mapping(address => uint256) private _withdrawableBalances;

    constructor(
        IDepositContract _depositContract,
        IStakingModuleManager _stakingModuleManager,
        address _owner
    ) {
        depositContract = _depositContract;
        stakingModuleManager = _stakingModuleManager;
        owner = _owner;
    }

    modifier onlyStakingModuleManager() {
        require(msg.sender == address(stakingModuleManager), "Invalid caller");
        _;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "StakigModule::onlyOwner - Invalid caller"
        );
        _;
    }

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
        _lockBalance(owner, msg.value);

        _totalBalance += msg.value;
    }

    function _lockBalance(address recipent, uint256 amount) internal {
        _lockedBalances[recipent] += amount;
        _totalLockedBalance += amount;
    }

    // Note
    // This function essentially serves the same purpose as creating a withdrawal request.
    // According to the current specifications, only full withdrawals are allowed, so specifying a partial amount is not possible.
    // However, in this implementation, we have accounted for the spec of Pectra, allowing this parameter to be set.
    // We expect that there will be no compatibility issues with the current spec(dencun) in this implementation.
    function _unlockBalance(address recipent, uint256 amount) internal {
        uint256 lockedBalance = _lockedBalances[recipent];
        require(
            amount <= lockedBalance,
            "Insufficient balance to process withdrawal request"
        );

        _lockedBalances[recipent] -= amount;
        _totalLockedBalance -= amount;

        _withdrawableBalances[recipent] += amount;
    }

    // Note
    // For the convenience of temporary implementation, the current setup assumes one validator per withdrawal address.
    // While this approach may be inefficient under the current spec(dencun),
    //  it is an area that can be significantly optimized by referencing examples from other protocols.
    // If the Pectra spec are applied, this implementation is expected to sufficiently replace the existing structure.
    function mintBond(
        IZeroCouponBond zcbContract,
        uint256 amount
    ) external onlyOwner {
        uint256 lockedBalance = _lockedBalances[msg.sender];
        require(amount <= lockedBalance, "Insufficient locked balance");

        _lockedBalances[msg.sender] -= amount;
        zcbContract.mint(msg.sender, amount);
        _lockedBalances[address(zcbContract)] += amount;
    }

    // Note
    // This function essentially represents the creation of a withdrawal request.
    // While it actually operates asynchronously, for convenience, this part is substituted with a state update.
    function createWithdrawal(uint256 amount) external {
        require(amount > 0, "Invalid amount");
        _unlockBalance(msg.sender, amount);
    }

    function completeWithdrawal() external {
        uint256 withdrawableBalance = _withdrawableBalances[msg.sender];
        require(withdrawableBalance > 0, "No withdrawable balance");

        _withdrawableBalances[msg.sender] = 0;
        Address.sendValue(payable(msg.sender), withdrawableBalance);
    }

    function _getWithdrawalCredentials() internal view returns (bytes memory) {
        return abi.encodePacked(bytes1(uint8(1)), bytes11(0), address(this));
    }
}

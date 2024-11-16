// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./IZeroCouponBond.sol";

interface IStakingModule {
    function stake(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot
    ) external payable;
    function mintBond(IZeroCouponBond zcbContract, uint256 amount) external;
    function createWithdrawal(uint256 amount) external;
    function completeWithdrawal() external;
    function totalLockedBalance() external view returns (uint256);
}

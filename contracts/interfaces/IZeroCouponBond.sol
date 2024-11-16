// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IZeroCouponBond is IERC20 {
    function mint(address to, uint256 amount) external;
    function redeem() external;
    function earlyRepayment() external payable;
    function secureFundsForValidator(
        address validator,
        bytes calldata proof
    ) external;
}

// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IZeroCouponBond is ERC20 {
    function issueBond(uint256 amount, uint256 maturityDate) external;
    function redeemBond(uint256 amount) external;
    function earlyRepayment(uint256 amount) external;
    function requestWithdrawalForValidator(uint256 amount) external;
    function secureFundsForValidator(address validator, string proof) external;
    function getFaceValue() external view returns (uint256);
    function getMaturityDate() external view returns (uint256);
    function getIssuerBalance(address issuer) external view returns (uint256);
}

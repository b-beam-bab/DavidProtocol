// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IZeroCouponBond is IERC20 {
    function mint(address to, uint256 amount) external;
    function redeem(uint256 amount) external;
    function earlyRepayment(uint256 amount) external;
    function requestWithdrawalForValidator(uint256 amount) external;
    function secureFundsForValidator(
        address validator,
        string calldata proof
    ) external;
    function getFaceValue() external view returns (uint256);
    function getMaturityDate() external view returns (uint256);
    function getIssuerBalance(address issuer) external view returns (uint256);
}

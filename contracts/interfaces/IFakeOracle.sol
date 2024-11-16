// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IFakeOracle {
    function averageYield() external view returns (uint256);
    function decimals() external view returns (uint8);
}

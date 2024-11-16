// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./interfaces/IFakeOracle.sol";

contract FakeOracle is IFakeOracle {
    uint256 private _averageYield;

    constructor(uint256 averageYield_) {
        _averageYield = averageYield_;
    }

    function averageYield() external view returns (uint256) {
        return _averageYield;
    }

    function decimals() external view returns (uint8) {
        return 18;
    }
}

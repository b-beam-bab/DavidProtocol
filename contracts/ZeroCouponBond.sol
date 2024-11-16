// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/IStakingModuleManager.sol";
import "./interfaces/IZeroCouponBond.sol";

contract ZeroCouponBond is ERC20, IZeroCouponBond {
    IStakingModuleManager public stakingModuleManager;
    uint256 public collateralRatio;
    uint256 public maturityBlock;

    constructor(
        IStakingModuleManager _stakingModuleManager,
        uint256 _collateralRatio,
        uint256 _duration
    ) ERC20("Zero Coupon Bond", "ZCB") {
        stakingModuleManager = _stakingModuleManager;
        collateralRatio = _collateralRatio;
        maturityBlock = block.number + _duration;
    }

    modifier notExpired() {
        require(maturityBlock < block.number, "This bond is expired");
        _;
    }

    // TODO: Add modifier checking valid caller
    function mint(address to, uint256 amount) external notExpired {
        _mint(to, amount);
    }

    function redeem(uint256 amount) external {}
    function earlyRepayment(uint256 amount) external {}
    function requestWithdrawalForValidator(uint256 amount) external {}
    function secureFundsForValidator(
        address validator,
        string calldata proof
    ) external {}
    function getFaceValue() external view returns (uint256) {}
    function getMaturityDate() external view returns (uint256) {}
    function getIssuerBalance(address issuer) external view returns (uint256) {}
}

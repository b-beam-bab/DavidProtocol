// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/IStakingModuleManager.sol";
import "./interfaces/IZeroCouponBond.sol";

contract ZeroCouponBond is ERC20, IZeroCouponBond {
    uint256 constant MAX_ISSUERS_COUNT = 2 ** 27;
    IStakingModuleManager public stakingModuleManager;
    uint256 public marginRatio;
    uint256 public maturityBlock;

    // uint256 public issueCount;
    // address[MAX_ISSUERS_COUNT] issuers;

    mapping(address => uint256) margins;
    mapping(address => uint256) collaterals;

    constructor(
        IStakingModuleManager _stakingModuleManager,
        uint256 _marginRatio,
        uint256 _duration
    ) ERC20("Zero Coupon Bond", "ZCB") {
        stakingModuleManager = _stakingModuleManager;
        marginRatio = _marginRatio;
        maturityBlock = block.number + _duration;
    }

    modifier notExpired() {
        require(maturityBlock < block.number, "This bond is expired");
        _;
    }

    // TODO: Add modifier checking valid caller
    function mint(address to, uint256 amount) external notExpired {
        uint256 margin = amount * marginRatio;
        uint256 collateral = amount - margin;
        _mint(to, collateral);

        collaterals[to] += collateral;
        margins[to] += margin;
    }

    function redeem() external {
        require(block.number > maturityBlock, "Bond has not been expired");

        uint256 bondBalance = balanceOf(msg.sender);
        require(bondBalance > 0, "No balance to redeem");

        // TODO: Add guard code checking balance
        _burn(msg.sender, bondBalance);
        Address.sendValue(payable(msg.sender), bondBalance);
    }

    function earlyRepayment() external {
        require(msg.value > 0, "Invalid value");
        require(block.number < maturityBlock, "Bond had been expired");

        uint256 collateral = collaterals[msg.sender];
        require(collateral > 0, "No debt to repay");

        if (collateral >= msg.value) {
            collaterals[msg.sender] -= msg.value;
        } else {
            collaterals[msg.sender] = 0;
        }
    }

    function requestWithdrawalForValidator(uint256 amount) external {}
    function secureFundsForValidator(
        address validator,
        string calldata proof
    ) external {}
    function getFaceValue() external view returns (uint256) {}
    function getMaturityDate() external view returns (uint256) {}
    function getIssuerBalance(address issuer) external view returns (uint256) {}
}

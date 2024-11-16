// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/IStakingModuleManager.sol";
import "./interfaces/IZeroCouponBond.sol";

interface PendingWithdrawal {
    address withdrawalCredential;
    uint256 amountToWithdraw;
    uint256 amountToLiquidate;
}

interface IssuerInfo {
    uint256 principal;
    uint256 collateral;
    uint256 margin;
}

contract ZeroCouponBond is ERC20, IZeroCouponBond {
    uint256 constant MAX_ISSUERS_COUNT = 2 ** 27;
    uint256 constant MAX_PENDING_WITHDRAWAL_COUNT = 2 ** 27;
    uint256 constant MAX_PENDING_WITHDRAWAL_PER_CALL = 100;

    IStakingModuleManager public stakingModuleManager;
    uint256 public marginRatio;
    uint256 public maturityBlock;

    // uint256 public issueCount;
    // address[MAX_ISSUERS_COUNT] issuers;

    mapping(address => IssuerInfo) issuers;

    uint256 pendingWithdrawalsHead;
    uint256 pendingWithdrawalsTail;
    PendingWithdrawal[MAX_PENDING_WITHDRAWAL_COUNT] pendingWithdrawals;

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

        issuers[to].principal += collateral;
        issuers[to].collateral += collateral;
        issuers[to].margin += margin;
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

    function createWithdrawalRequest(
        address recipient,
        uint256 amountToWithdraw,
        uint256 amountToRefund
    ) {
        IStakingModule(recipient).createWithdrawal(amount);
        PendingWithdrawal p = PendingWithdrawal(
            recipient,
            amountToWithdraw,
            amountToRefund
        );
        pendingWithdrawals[pendingWithdrawalsTail] = p;
        pendingWithdrawalsTail++;
    }

    // TODO: An entity to have eligibility to run this funcion will be determined in the future
    function completePendingWithdrawals() external {
        uint256 count;
        for (
            uint256 pos = pendingWithdrawalsHead;
            pos < pendingWithdrawalsTail;
            pos++
        ) {
            if (count >= MAX_PENDING_WITHDRAWAL_COUNT) {
                break;
            }

            PendingWithdrawal p = pendingWithdrawals[pos];
            IStakingModule(p.withdrawalCredential).completeWithdrawal();

            uint256 amountToRefund = p.amountToWithdraw - p.amountToLiquidate;
            if (amountToRefund > 0) {
                Address.sendValue(
                    payable(p.withdrawalCredential),
                    amountToRefund
                );
            }
        }

        pendingWithdrawalsHead += count;
        if (pendingWithdrawalsHead > pendingWithdrawalsTail) {
            pendingWithdrawalsHead = 0;
            pendingWithdrawalsTail = 0;
        }
    }

    function secureFundsForValidator(
        address validator,
        bytes calldata proof
    ) external {
        bool needToLiqudate = verifyLiquidation(proof);
        require(
            needToLiqudate,
            "Not meet the conditions required for liquidation"
        );

        uint256 penalty = verifyPenalty(proof);
        IssuerInfo issuerInfo = issuers[validator];

        uint256 amountToWithdraw = issuerInfo.principal + issuerInfo.margin;
        uint256 amountToLiquidate = issuerInfo.collateral + penalty;

        issuers[validator] = IssuerInfo(0, 0, 0);
        createWithdrawalRequest(validator, amountToWithdraw, amountToLiquidate);
    }

    function getFaceValue() external view returns (uint256) {}
    function getMaturityDate() external view returns (uint256) {}
    function getIssuerBalance(address issuer) external view returns (uint256) {}

    function verifyPenalty(bytes calldata proof) internal returns (uint256) {
        // TODO: Do something to verify proof and get value of penalty
        uint256 penalty = 0;
        return 0;
    }

    function verifyLiquidation(bytes calldata proof) internal returns (bool) {
        // TODO: Do something to verify proof and check condition of liquidation
        return true;
    }
}

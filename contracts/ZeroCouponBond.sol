// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/IStakingModuleManager.sol";
import "./interfaces/IZeroCouponBond.sol";

struct PendingWithdrawal {
    address withdrawalCredential;
    uint256 amountToWithdraw;
    uint256 amountToLiquidate;
}

struct IssuerInfo {
    uint256 principal;
    uint256 collateral;
    uint256 margin;
}

contract ZeroCouponBond is ERC20, IZeroCouponBond {
    uint256 constant MAX_PENDING_WITHDRAWAL_COUNT = 2 ** 27;
    uint256 constant MAX_PENDING_WITHDRAWAL_PER_CALL = 100;

    IStakingModuleManager public stakingModuleManager;
    uint256 public marginRatio;
    uint256 public maturity;

    mapping(address => IssuerInfo) private issuers;

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
        maturity = block.timestamp + _duration;
    }

    modifier expired() {
        require(maturity >= block.timestamp, "This bond is not expired");
        _;
    }

    modifier notExpired() {
        require(maturity < block.timestamp, "This bond is expired");
        _;
    }

    ///////////////////////////////////////////////
    // Actions from the bond issuers perspective

    // TODO: Add modifier checking valid caller
    function mint(address to, uint256 amount) external notExpired {
        uint256 margin = amount * marginRatio;
        uint256 collateral = amount - margin;
        _mint(to, collateral);

        issuers[to].principal += collateral;
        issuers[to].collateral += collateral;
        issuers[to].margin += margin;
    }

    function earlyRepay() external payable notExpired {
        require(msg.value > 0, "Invalid value");

        require(issuers[msg.sender].collateral > 0, "No debt to repay");

        if (issuers[msg.sender].collateral >= msg.value) {
            issuers[msg.sender].collateral -= msg.value;
        } else {
            issuers[msg.sender].collateral = 0;
        }
    }

    ///////////////////////////////////////////////
    // Actions from the bond holder’s perspective

    function redeem() external expired {
        uint256 bondBalance = balanceOf(msg.sender);
        require(bondBalance > 0, "No balance to redeem");

        // TODO: Add guard code checking balance
        _burn(msg.sender, bondBalance);
        Address.sendValue(payable(msg.sender), bondBalance);
    }

    ///////////////////////////////////////////////
    // Actions from the system manager's perspective

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
        IssuerInfo memory issuerInfo = issuers[validator];

        uint256 amountToWithdraw = issuerInfo.principal + issuerInfo.margin;
        uint256 amountToLiquidate = issuerInfo.collateral + penalty;

        issuers[validator] = IssuerInfo(0, 0, 0);
        createWithdrawalRequest(validator, amountToWithdraw, amountToLiquidate);
    }

    ///////////////////////////////////////////////
    // Helpers

    function createWithdrawalRequest(
        address recipient,
        uint256 amountToWithdraw,
        uint256 amountToLiquidation
    ) internal {
        IStakingModule(recipient).createWithdrawal(amountToWithdraw);
        PendingWithdrawal memory p = PendingWithdrawal(
            recipient,
            amountToWithdraw,
            amountToLiquidation
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

            PendingWithdrawal memory p = pendingWithdrawals[pos];
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

    ///////////////////////////////////////////////
    // Predicates

    function verifyPenalty(
        bytes calldata proof
    ) internal pure returns (uint256) {
        // TODO: Do something to verify proof and get value of penalty
        uint256 penalty = 0;
        return 0;
    }

    function verifyLiquidation(
        bytes calldata proof
    ) internal pure returns (bool) {
        // TODO: Do something to verify proof and check condition of liquidation
        return true;
    }
}

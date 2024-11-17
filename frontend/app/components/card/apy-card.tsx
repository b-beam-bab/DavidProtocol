"use client";

import { BarChartIcon as ChartSpline, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "wagmi";
import { useDepositAmount } from "@/lib/hooks/use-deposit-amount";
import { useBondBalance } from "@/lib/hooks/use-bond-balance";
import React from "react";
import { formatEther } from "viem";

const BASE_APY = 4.8; // Base APY percentage

export const APYCard = () => {
  const { address } = useAccount();
  const { balance: depositInGwei, refetch: refetchDepositAmount } =
    useDepositAmount(address);
  const { balance: bondBalanceInGwei, refetch: refetchBondBalance } =
    useBondBalance(address);

  React.useEffect(() => {
    refetchDepositAmount();
  }, [address, refetchDepositAmount]);

  React.useEffect(() => {
    refetchBondBalance();
  }, [address, refetchBondBalance]);

  const depositInEth = formatEther(depositInGwei);

  const totalGwei = depositInGwei + (bondBalanceInGwei ?? BigInt(0));
  const totalEth = formatEther(totalGwei);

  const ratio = Number(totalEth) / Number(depositInEth);
  const adjustedAPY = BASE_APY * ratio;
  const isIncreased = adjustedAPY > BASE_APY;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Expected APY</CardTitle>
        <ChartSpline className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{adjustedAPY.toFixed(2)}%</div>
            {isIncreased && (
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+{((ratio - 1) * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on current network conditions
            {isIncreased && " • Enhanced by validator performance"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import { CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEthPrice } from "@/lib/hooks/use-eth-price";
import { useAccount } from "wagmi";
import { useDepositAmount } from "@/lib/hooks/use-deposit-amount";
import { formatEther } from "viem";
import { useBondBalance } from "@/lib/hooks/use-bond-balance";
import React from "react";

export const CurrentBalanceCard = () => {
  const { address } = useAccount();
  const { data: price, isLoading } = useEthPrice();
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

  const totalGwei = depositInGwei + (bondBalanceInGwei ?? BigInt(0));
  const totalEth = formatEther(totalGwei);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalEth} ETH</div>
        {isLoading || !price ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            ≈ ${(price * Number(totalEth)).toFixed(4)} USD
          </p>
        )}
      </CardContent>
    </Card>
  );
};

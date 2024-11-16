"use client";

import { Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AddDepositDialog } from "../dialog/add-deposit-dialog";
import { useEthPrice } from "@/lib/hooks/use-eth-price";
import { useDepositAmount } from "@/lib/hooks/use-deposit-amount";
import { useAccount } from "wagmi";
import { formatEther } from "viem";

export const TotalDepositCard = () => {
  const { address } = useAccount();
  const { data: price, isLoading } = useEthPrice();
  const { balance: depositInGwei } = useDepositAmount(address);

  const deposit = formatEther(depositInGwei);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Deposit</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{Number(deposit)} ETH</div>
        {isLoading || !price ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            ≈ ${price * Number(deposit)} USD
          </p>
        )}
      </CardContent>
      <CardFooter>
        <AddDepositDialog />
      </CardFooter>
    </Card>
  );
};

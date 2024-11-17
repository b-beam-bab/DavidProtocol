"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionState } from "@/lib/types";
import { ErrorIcon, SuccessIcon } from "../svg";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { STAKING_MODULE_MANAGER_ADDRESS } from "@/constants/contract";
import { abi as smmAbi } from "@/abi/staking-module-manager";
import { genRanHex } from "@/mock/validator";
import { parseEther } from "viem";

export function AddDepositDialog() {
  const [amount, setAmount] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [txState, setTxState] = React.useState<TransactionState>("idle");

  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  React.useEffect(() => {
    if (isPending || isConfirming) {
      setTxState("loading");
    } else if (isConfirmed) {
      setTxState("success");
      const timer = setTimeout(() => {
        setIsOpen(false);
        setAmount("");
        setTxState("idle");
      }, 2000); // Added explicit timeout
      return () => clearTimeout(timer); // Cleanup timeout
    } else if (error) {
      setTxState("error");
    }
  }, [isPending, isConfirming, isConfirmed, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTxState("loading");

    const randomPubkey = "0x" as `0x${string}`;
    const randomSig = `0x${genRanHex(64)}` as `0x${string}`;
    const depositDataRoot = `0x${genRanHex(64)}` as `0x${string}`;

    const valueInWei = parseEther(amount);

    writeContract({
      address: STAKING_MODULE_MANAGER_ADDRESS,
      abi: smmAbi,
      functionName: "stake",
      args: [randomPubkey, randomSig, depositDataRoot],
      value: valueInWei,
    });
  };

  const renderContent = () => {
    switch (txState) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-center">
              Processing deposit for {amount} ETH...
            </p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-primary/10 p-3">
              <div className="rounded-full bg-primary/20 p-2">
                <SuccessIcon />
              </div>
            </div>
            <p className="text-center">
              Successfully processed deposit for {amount} ETH
            </p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-destructive/10 p-3">
              <ErrorIcon />
            </div>
            <p className="text-center text-destructive">
              {(error as BaseError).shortMessage || error?.message}
            </p>
            <Button variant="outline" onClick={() => setTxState("idle")}>
              Try Again
            </Button>
          </div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
                <span className="text-sm font-medium">ETH</span>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Deposit
            </Button>
          </form>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Add Deposit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Deposit</DialogTitle>
          <DialogDescription>
            Enter the amount of ETH you want to deposit.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

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

type TransactionState = "idle" | "loading" | "success" | "error";

export function AddDepositDialog() {
  const [amount, setAmount] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [txState, setTxState] = React.useState<TransactionState>("idle");
  const [error, setError] = React.useState("");

  // Simulate transaction - replace with actual blockchain transaction
  const processDeposit = async () => {
    setTxState("loading");
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve(true);
          } else {
            reject(new Error("Transaction failed"));
          }
        }, 2000);
      });
      setTxState("success");
      // Reset after success
      setTimeout(() => {
        setIsOpen(false);
        setAmount("");
        setTxState("idle");
      }, 2000);
    } catch (err) {
      setTxState("error");
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processDeposit();
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
            <p className="text-center text-destructive">{error}</p>
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
                  step="0.1"
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

const SuccessIcon = () => (
  <svg
    className="h-6 w-6 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

SuccessIcon.displayName = "SuccessIcon";

const ErrorIcon = () => (
  <svg
    className="h-6 w-6 text-destructive"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

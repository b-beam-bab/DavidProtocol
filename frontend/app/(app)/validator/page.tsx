import { Wallet, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddDepositDialog } from "@/components/dialog/add-deposit-dialog";
import { IssueBondDialog } from "@/components/dialog/issue-bond-dialog";

export default function ValidatorPage() {
  const deposit = 20;
  const availableDeposit = 10;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Operator Actions</h1>
        <p className="text-lg text-muted-foreground">
          As an operator, you can perform two key actions: deposit ETH to become
          a validator, and issue bonds against your deposit.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Deposit Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Deposit
            </CardTitle>
            <CardDescription>Deposit ETH to become a validator</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{deposit} ETH</p>
            <p className="text-sm text-muted-foreground">
              Current deposit amount
            </p>
          </CardContent>
          <CardFooter>
            <AddDepositDialog />
          </CardFooter>
        </Card>

        {/* Issue Bond Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Issue Bond
            </CardTitle>
            <CardDescription>
              Issue a new bond against your deposit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {availableDeposit > 0 ? "Ready to Issue" : "Deposit Required"}
            </p>
            <p className="text-sm text-muted-foreground">
              {availableDeposit > 0
                ? "You can now issue bonds"
                : "Make a deposit to issue bonds"}
            </p>
          </CardContent>
          <CardFooter>
            <IssueBondDialog availableDeposit={availableDeposit} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

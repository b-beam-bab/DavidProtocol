"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Suspense } from "react";
import { CurrentBalanceCard } from "@/components/card/current-balance-card";
import { TotalDepositCard } from "@/components/card/total-deposit-card";
import { APYCard } from "@/components/card/apy-card";
import { MOCK_ISSUED_BONDS } from "@/mock/bond";
import { BondCard } from "@/components/card/bond-card";

export default function Operator() {
  const totalEthBalance = 25;
  const totalDeposit = 32;

  return (
    <div className="container mx-auto px-4 py-6 bg-white/90">
      <h1 className="mb-8 text-3xl font-bold">Operator Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Suspense>
          <CurrentBalanceCard totalEth={totalEthBalance} />
        </Suspense>
        <Suspense>
          <TotalDepositCard totalDeposit={totalDeposit} />
        </Suspense>
        <APYCard />
      </div>

      {/* Issued Bonds Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Issued Bonds</h2>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
          <div className="flex gap-4 p-4">
            {MOCK_ISSUED_BONDS.map((bond) => (
              <BondCard key={bond.id} bond={bond} />
            ))}

            {/* Issue New Bond Card */}
            <Card className="flex w-[300px] shrink-0 items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center py-8 w-full">
                <Link href="/operator" className="flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-20 w-20 rounded-full"
                  >
                    <Plus className="h-10 w-10" />
                  </Button>
                </Link>
                <p className="mt-4 text-center font-medium">Issue New Bond</p>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

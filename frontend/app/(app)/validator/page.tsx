"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IssueBondDialog } from "@/components/dialog/issue-bond-dialog";
import { CurrentBalanceCard } from "@/components/card/current-balance-card";
import { TotalDepositCard } from "@/components/card/total-deposit-card";
import { APYCard } from "@/components/card/apy-card";
import { BondCard } from "@/components/card/bond-card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { useMyBondList } from "@/lib/hooks/use-my-bond-lists";
import { useAccount } from "wagmi";

export default function ValidatorPage() {
  const { address } = useAccount();
  const { myBonds } = useMyBondList(address);

  return (
    <div className="pt-4">
      <div className="flex items-center justify-center  h-[236px] bg-gradient-to-r from-[#DAC2D8] to-[#F6EAF5]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Validator</h1>
          <p className="text-lg text-muted-foreground">
            As an validator, you can perform two key actions: deposit ETH to
            become a validator, and issue bonds against your deposit.
          </p>
        </div>
      </div>

      <div className="mx-auto pt-8 pb-[100px] px-[108px] bg-white">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <CurrentBalanceCard />
          <TotalDepositCard />
          <APYCard />
        </div>

        {/* Issued Bonds Section */}
        <div className="space-y-4 max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Issued Bonds</h2>
          </div>

          <ScrollArea className="overflow-auto w-full whitespace-nowrap rounded-lg border">
            <div className="flex gap-4 p-4">
              {myBonds.map((bond) => (
                <BondCard key={bond.maturity} bond={bond} />
              ))}

              {/* Issue New Bond Card */}
              <Card className="flex w-[300px] shrink-0 items-center justify-center">
                <CardContent className="flex flex-col items-center justify-center py-8 w-full">
                  <CardFooter>
                    <IssueBondDialog />
                  </CardFooter>
                </CardContent>
              </Card>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

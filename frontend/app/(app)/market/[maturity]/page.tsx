"use client";

import * as React from "react";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BondPriceChart } from "@/components/chart/bond-price-chart";
import { SwapUI } from "@/components/swap";
import { MOCK_BONDS } from "@/mock/bond";

type Props = {
  params: {
    maturity: string;
  };
};

export default function BondDetail({ params }: Props) {
  const { maturity } = params;

  console.log("Maturity:", maturity);

  const bond = MOCK_BONDS[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            size="sm"
            className="mb-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Market
          </Button>
          <h1 className="text-3xl font-bold">Bond Detail</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <BondPriceChart currentPrice={bond.price} />
            </CardContent>
          </Card>

          {/* Bond Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Maturity Date
                  </dt>
                  <dd className="text-lg font-semibold">
                    {new Date(bond.maturityDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Current Price
                  </dt>
                  <dd className="text-lg font-semibold">{bond.price} ETH</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Fixed APY
                  </dt>
                  <dd className="text-lg font-semibold">{bond.fixedAPY}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Total Liquidity
                  </dt>
                  <dd className="text-lg font-semibold">$ {bond.liquidity}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <SwapUI bond={bond} />
      </div>
    </div>
  );
}

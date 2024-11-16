"use client";

import * as React from "react";
import { ArrowLeftIcon, InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BondPriceChart } from "@/components/chart/bond-price-chart";

type Props = {
  params: {
    maturity: string;
  };
};

export default function BondDetail({ params }: Props) {
  const { maturity } = params;

  // This would be fetched from an API in a real application
  const bondInfo = {
    name: "ETH Bond",
    maturityDate: new Date(maturity).toLocaleDateString(),
    currentPrice: 0.95,
    fixedAPY: 4.5,
    totalLiquidity: 1000,
    totalVolume: 5000,
  };

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
          <h1 className="text-3xl font-bold">{bondInfo.name} Detail</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Bond Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Bond Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <BondPriceChart currentPrice={bondInfo.currentPrice} />
            </CardContent>
          </Card>

          {/* Bond Details */}
          <Card>
            <CardHeader>
              <CardTitle>Bond Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Maturity Date
                  </dt>
                  <dd className="text-lg font-semibold">
                    {bondInfo.maturityDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Current Price
                  </dt>
                  <dd className="text-lg font-semibold">
                    {bondInfo.currentPrice} ETH
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Fixed APY
                  </dt>
                  <dd className="text-lg font-semibold">
                    {bondInfo.fixedAPY}%
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Total Liquidity
                  </dt>
                  <dd className="text-lg font-semibold">
                    {bondInfo.totalLiquidity} ETH
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Total Volume
                  </dt>
                  <dd className="text-lg font-semibold">
                    {bondInfo.totalVolume} ETH
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Swap UI Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Swap</CardTitle>
            <CardDescription>Trade this bond</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-muted p-6 flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Swap UI will be implemented using an external SDK
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Additional Information
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Important details about this bond and its terms.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section can include important disclaimers, terms and
            conditions, or any other relevant information about the bond.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

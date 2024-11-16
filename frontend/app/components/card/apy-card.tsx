"use client";

import { ChartSpline } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const APY = 4.8; // TODO: hardcoded value

export const APYCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Expected APY</CardTitle>
        <ChartSpline className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{APY.toFixed(2)}%</div>
        <p className="text-xs text-muted-foreground">
          Based on current network conditions
        </p>
      </CardContent>
    </Card>
  );
};

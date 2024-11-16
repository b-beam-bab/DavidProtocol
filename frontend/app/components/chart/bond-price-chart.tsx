"use client";

import { generateMockPriceHistory } from "@/mock/bond";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BondPriceChartProps = {
  currentPrice: number;
};

export const BondPriceChart = ({ currentPrice }: BondPriceChartProps) => {
  const priceHistory = React.useMemo(
    () => generateMockPriceHistory(currentPrice),
    [currentPrice]
  );

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={priceHistory}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.1}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--muted-foreground))"
            opacity={0.2}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            interval={14} // Show every 14th tick to prevent overlap
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            domain={[0.8, 1.0]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value.toFixed(2)} ETH`}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(3)} ETH`, "Price"]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorPrice)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "hsl(var(--background))",
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

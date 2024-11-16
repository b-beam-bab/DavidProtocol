"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Sample data - replace with actual data in production
const bonds = [
  {
    id: 1,
    amount: 15,
    currentPrice: 0.95,
    maturityDate: "2024-12-31",
    fixedAPY: 4.5,
  },
  {
    id: 2,
    amount: 10,
    currentPrice: 0.97,
    maturityDate: "2025-06-30",
    fixedAPY: 5.2,
  },
];

export default function Operator() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-white/90">
      <h1 className="mb-8 text-3xl font-bold">Operator Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25 ETH</div>
            <p className="text-xs text-muted-foreground">≈ $62,500 USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposit</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 ETH</div>
            <p className="text-xs text-muted-foreground">
              Initial validator deposit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected APY</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.80%</div>
            <p className="text-xs text-muted-foreground">
              Based on current network conditions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issued Bonds Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Issued Bonds</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
          <div ref={scrollRef} className="flex gap-4 p-4">
            {bonds.map((bond) => (
              <Card key={bond.id} className="w-[300px] shrink-0">
                <CardHeader>
                  <CardTitle>{bond.amount} ETH</CardTitle>
                  <CardDescription>Bond #{bond.id}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current Price
                    </span>
                    <span className="font-medium">{bond.currentPrice} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Maturity Date
                    </span>
                    <span className="font-medium">
                      {new Date(bond.maturityDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Fixed APY
                    </span>
                    <span className="font-medium">{bond.fixedAPY}%</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Issue New Bond Card */}
            <Card className="flex w-[300px] shrink-0 items-center justify-center">
              <CardContent className="py-8">
                <Link href="/issue-bond">
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

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { BondTableHeader, BondTableRow } from "@/components/table/bond-table";
import { MOCK_BONDS } from "@/mock/bond";

type SortField = "maturity" | "liquidity" | "currentPrice";
type SortOrder = "asc" | "desc";

export default function MarketPage() {
  const [sortField, setSortField] = useState<SortField>("maturity");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedBonds = [...MOCK_BONDS].sort((a, b) => {
    if (sortField === "maturity") {
      return sortOrder === "asc"
        ? a.maturityDate - b.maturityDate
        : b.maturityDate - a.maturityDate;
    } else if (sortField === "liquidity") {
      return sortOrder === "asc"
        ? a.liquidity - b.liquidity
        : b.liquidity - a.liquidity;
    } else {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Trade Bonds</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Explore and delegate to our unified bond liquidity pool. Each bond
            represents a standardized zero-coupon bond with equal value, helping
            to decentralize the delegation process and reduce capital
            centralization among validators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <BondTableHeader
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <TableBody>
                {sortedBonds.map((bond) => (
                  <BondTableRow key={bond.id} bond={bond} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

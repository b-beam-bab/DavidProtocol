"use client";

import { ArrowUpDown, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Bond } from "@/lib/types";
import { DAY_IN_MS } from "@/constants/time";

const BondTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead>
          <Button
            variant="ghost"
            className="flex items-center gap-1 font-semibold"
          >
            Name
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="flex items-center gap-1 font-semibold"
          >
            Maturity
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="flex items-center gap-1 font-semibold"
          >
            Liquidity
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="flex items-center gap-1 font-semibold"
          >
            Total TVL
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-1">
            Maturity Value
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="p-2 mb-2 bg-white shadow">
                  <p>Principal Token Maturity Value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="flex items-center gap-1 font-semibold"
          >
            Fixed APY
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

type BondTableRowProps = {
  bond: Bond;
};

const BondTableRow = ({ bond }: BondTableRowProps) => {
  const daysRemaining = Math.ceil(
    (bond.maturityDate - new Date().getTime()) / DAY_IN_MS
  );

  return (
    <TableRow
      key={bond.id}
      className="cursor-pointer transition-colors hover:bg-accent/50"
      onClick={() => (window.location.href = `/market/${bond.maturityDate}`)}
    >
      <TableCell>
        <div className="font-medium">{bond.name}</div>
        <div className="text-sm text-muted-foreground">{bond.network.name}</div>
      </TableCell>
      <TableCell>
        <div>
          {new Date(bond.maturityDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="text-sm text-muted-foreground">
          {daysRemaining} days
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">${bond.liquidity}M</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">${bond.totalTVL}M</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{bond.maturityValue}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-accent/30 px-2 py-1 text-accent-foreground">
            {bond.fixedAPY}%
          </div>
          <div className="text-sm text-muted-foreground">${bond.price}</div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export { BondTableHeader, BondTableRow };

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bond } from "@/lib/types";
import { DAY_IN_MS } from "@/constants/time";
import Link from "next/link";

type SortField = "maturity" | "liquidity" | "currentPrice";
type SortOrder = "asc" | "desc";

type BondTableHeaderProps = {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
};

const BondTableHeader = ({
  sortField,
  sortOrder,
  onSort,
}: BondTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("maturity")}
            className="flex items-center gap-1 font-semibold"
          >
            Maturity
            <ArrowUp
              className={`h-4 w-4 transition-transform duration-200 ${
                sortField === "maturity"
                  ? `text-primary ${sortOrder === "desc" ? "rotate-180" : ""}`
                  : ""
              }`}
            />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("liquidity")}
            className="flex items-center gap-1 font-semibold"
          >
            Liquidity
            <ArrowUp
              className={`h-4 w-4 transition-transform duration-200 ${
                sortField === "liquidity"
                  ? `text-primary ${sortOrder === "desc" ? "rotate-180" : ""}`
                  : ""
              }`}
            />
          </Button>
        </TableHead>
        <TableHead>
          <div className="font-semibold">Maturity Value</div>
        </TableHead>
        <TableHead>
          <div className="font-semibold">Fixed APY</div>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("currentPrice")}
            className="flex items-center gap-1 font-semibold"
          >
            Current Price
            <ArrowUp
              className={`h-4 w-4 transition-transform duration-200 ${
                sortField === "currentPrice"
                  ? `text-primary ${sortOrder === "desc" ? "rotate-180" : ""}`
                  : ""
              }`}
            />
          </Button>
        </TableHead>
        <TableHead></TableHead>
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
    <TableRow key={bond.id} className="">
      <TableCell>
        <div className="flex gap-[12px] items-center">
          <div>
            {new Date(bond.maturityDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-sm text-muted-foreground text-[#B45BA9] bg-[#F1E1EF] px-[6px] py-[4px] rounded-[8px]">
            {daysRemaining} days
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">${bond.liquidity}M</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{bond.maturityValue}</div>
      </TableCell>
      <TableCell>
        <div className="rounded-md bg-accent/30 px-2 py-1 text-accent-foreground inline-block">
          {bond.fixedAPY}%
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">${bond.price}</div>
      </TableCell>
      <TableCell>
        <Link className="w-full" href={`/market/${bond.maturityDate}`}>
          <Button className="w-full rounded-[40px]">Trade</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export { BondTableHeader, BondTableRow };

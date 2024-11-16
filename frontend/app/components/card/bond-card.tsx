import { Bond } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

export const BondCard = ({ bond }: { bond: Bond & { amount: number } }) => {
  const fixedAPY = ((1 / bond.price - 1) * 100).toFixed(2);

  return (
    <Card key={bond.maturity} className="w-[300px] shrink-0">
      <CardHeader>
        <CardTitle>{bond.amount} ETH</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Current Price</span>
          <span className="font-medium">{bond.price} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Maturity Date</span>
          <span className="font-medium">
            {new Date(bond.maturity).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Fixed APY</span>
          <span className="font-medium">{fixedAPY}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link className="w-full" href={`/market/${bond.maturity}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

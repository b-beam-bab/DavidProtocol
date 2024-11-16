import { CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEthPrice } from "@/lib/hooks/use-eth-price";

type CurrentBalanceCardProps = {
  totalEth: number;
};

export const CurrentBalanceCard = ({ totalEth }: CurrentBalanceCardProps) => {
  const { data: price, isLoading } = useEthPrice();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalEth} ETH</div>
        {isLoading || !price ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            ≈ ${price * totalEth} USD
          </p>
        )}
      </CardContent>
    </Card>
  );
};

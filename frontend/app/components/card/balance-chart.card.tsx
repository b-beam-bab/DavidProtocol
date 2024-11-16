import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEthPrice } from "@/lib/hooks/use-eth-price";
import { Wallet } from "lucide-react";

export const BalanceChartCard = async () => {
  const currentBalance = 25;
  const { data: price, isLoading } = useEthPrice();

  return (
    <Card className="min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Balance Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">{currentBalance} ETH</div>
          {isLoading || !price ? (
            <p className="text-xs text-muted-foreground">Loading...</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              ≈ ${price * currentBalance} USD
            </p>
          )}
        </div>
        <div className="h-[250px] rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
          <p className="text-muted-foreground">
            Chart will be implemented later
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

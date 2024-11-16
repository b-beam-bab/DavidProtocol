import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBondBalance } from "@/lib/hooks/use-bond-balance";
import { useDepositAmount } from "@/lib/hooks/use-deposit-amount";
import { useEthPrice } from "@/lib/hooks/use-eth-price";
import { Wallet } from "lucide-react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

export const BalanceChartCard = async () => {
  const { address } = useAccount();
  const { data: price, isLoading } = useEthPrice();
  const { balance: depositInGwei } = useDepositAmount(address);
  const { balance: bondBalanceInGwei } = useBondBalance(address);

  const totalGwei = depositInGwei + (bondBalanceInGwei ?? BigInt(0));
  const totalEth = formatEther(totalGwei);

  return (
    <Card className="min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Balance Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">{totalEth} ETH</div>
          {isLoading || !price ? (
            <p className="text-xs text-muted-foreground">Loading...</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              ≈ ${price * Number(totalEth)} USD
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

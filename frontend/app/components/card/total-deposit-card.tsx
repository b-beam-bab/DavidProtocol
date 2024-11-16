import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getEthPrice } from "@/lib/price";

type TotalDepositCardProps = {
  totalDeposit: number;
};

export const TotalDepositCard = async ({
  totalDeposit,
}: TotalDepositCardProps) => {
  const price = await getEthPrice();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Deposit</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalDeposit} ETH</div>
        <p className="text-xs text-muted-foreground">≈ ${price * 25} USD</p>
      </CardContent>
    </Card>
  );
};

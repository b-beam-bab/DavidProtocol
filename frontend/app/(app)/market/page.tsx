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

export default function MarketPage() {
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
              <BondTableHeader />
              <TableBody>
                {MOCK_BONDS.map((bond) => (
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

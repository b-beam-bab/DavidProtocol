import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Onboarding() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome onboard!
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Join our decentralized delegation platform where you can trade
            validator bonds or become a validator yourself. Choose your path to
            participate in securing the Ethereum network.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="relative overflow-hidden transition-colors hover:bg-accent/90">
            <Link href="/market" className="block p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Trade Bonds</CardTitle>
                <CardDescription className="text-base">
                  Explore our bond marketplace and start trading validator bonds
                  with standardized terms
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6 mb-10">
                <ul className="grid gap-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Access liquid staking positions
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Trade with fixed terms and maturity
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Earn yield through price appreciation
                  </li>
                </ul>
              </CardContent>
              <Button className="absolute bottom-6 right-6" variant="outline">
                Go to Market
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card className="relative overflow-hidden transition-colors hover:bg-accent/90">
            <Link href="/validator" className="block p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Become a Validator</CardTitle>
                <CardDescription className="text-base">
                  Deposit ETH and operate a validator node to earn rewards and
                  contribute to network security
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6 mb-10">
                <ul className="grid gap-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Earn staking rewards
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Issue bonds against your position
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Participate in network security
                  </li>
                </ul>
              </CardContent>
              <Button className="absolute bottom-6 right-6" variant="outline">
                Start Validating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

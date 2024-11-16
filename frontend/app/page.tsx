import Link from "next/link";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "./components/layout/Header";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="w-full h-[580px] py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="mx-auto container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Decentralize Ethereum PoS Delegation
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  We decentralize delegation through a unified bond liquidity
                  pool, reducing capital centralization among large validators.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 h-[580px] md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="mx-auto container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-12 text-center">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Decentralized Delegation</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Reduce capital centralization with our innovative bond
                  liquidity pool.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Zap className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Efficient Staking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Streamline your staking process with standardized zero-coupon
                  bonds.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <BarChart3 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Transparent Markets</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Access liquid markets with clear pricing and maturity dates.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full h-[580px] py-12 md:py-24 lg:py-32">
          <div className="mx-auto container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Decentralizing Today
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join our platform and contribute to a more decentralized
                  Ethereum network.
                </p>
              </div>
              <Link href="/market">
                <Button
                  size="lg"
                  className="inline-flex items-center justify-center"
                >
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 EthBond. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

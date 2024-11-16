"use client";

import Link from "next/link";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-20 items-center px-4 md:px-6">
        <Link className="flex items-center justify-center" href="/">
          <span className="ml-2 text-2xl font-bold">EthBond</span>
        </Link>

        <div className="ml-10 hidden md:flex md:gap-x-6">
          {navigation.map((item) => (
            <div key={item.name} className="relative">
              <Link
                href={item.href}
                className={`text-sm font-medium transition-colors text-primary relative group`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                    pathname === item.href ? "scale-x-100" : "scale-x-0"
                  } group-hover:scale-x-100`}
                />
              </Link>
            </div>
          ))}
        </div>

        {pathname != "/" ? (
          <div className="ml-auto">
            <Wallet>
              <ConnectWallet withWalletAggregator>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        ) : (
          <nav className="ml-auto">
            <Link href="/market">
              <Button>
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        )}
      </nav>
    </header>
  );
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Market", href: "/market" },
  { name: "Operator", href: "/operator" },
];

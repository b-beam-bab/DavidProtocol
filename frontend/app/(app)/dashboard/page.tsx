"use client";

import { useBondBalance } from "@/lib/hooks/use-bond-balance";
import { useAccount } from "wagmi";
import Onboarding from "./components/onboarding";
import Investor from "./components/investor";
import React from "react";

export default function Dashboard() {
  const { address } = useAccount();
  const { balance: bondBalance, refetch: refetchBondBalance } =
    useBondBalance(address);

  React.useEffect(() => {
    refetchBondBalance();
  }, [address, refetchBondBalance]);

  // Case 1: Show onboarding if bond balance is zero
  if (!bondBalance) {
    return <Onboarding />;
  }

  // Case 2: Show investor dashboard if bond balance exists
  return <Investor />;
}

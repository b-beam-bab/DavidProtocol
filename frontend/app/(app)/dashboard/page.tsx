"use client";

import { useBondBalance } from "@/lib/hooks/use-bond-balance";
import { useDepositAmount } from "@/lib/hooks/use-deposit-amount";
import { useAccount } from "wagmi";
import Onboarding from "./components/onboarding";
import Operator from "./components/operator";
import Investor from "./components/investor";

export default function Dashboard() {
  const account = useAccount();

  const depositAmount = useDepositAmount(account.address);
  const bondBalance = useBondBalance(account.address);

  // Case 1: Show onboarding if both deposit and bond are zero
  if (!depositAmount && !bondBalance) {
    return <Onboarding />;
  }

  // Case 2: Show operator dashboard if deposit exists
  if (depositAmount) {
    return <Operator />;
  }

  // Case 3: Show investor dashboard if bond balance exists
  if (bondBalance) {
    return <Investor />;
  }

  // Fallback view (shouldn't normally reach here based on conditions)
  return null;
}

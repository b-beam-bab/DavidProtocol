import { abi as zcpAbi } from "@/abi/zero-coupon-bond";
import {
  ZERO_COUPON_BOND_ADDRESS_0,
  ZERO_COUPON_BOND_ADDRESS_1,
  ZERO_COUPON_BOND_ADDRESS_2,
} from "@/constants/contract";
import { useReadContracts } from "wagmi";
import { useAvailableBonds } from "./use-available-bonds";
import { Bond } from "../types";

export const useMyBondList = (
  address: `0x${string}` | undefined
): {
  myBonds: (Bond & { balance: bigint })[];
  isPending: boolean;
  error: Error | null;
} => {
  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        address: ZERO_COUPON_BOND_ADDRESS_0,
        abi: zcpAbi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
      },
      {
        address: ZERO_COUPON_BOND_ADDRESS_1,
        abi: zcpAbi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
      },
      {
        address: ZERO_COUPON_BOND_ADDRESS_2,
        abi: zcpAbi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
      },
    ],
    query: {
      enabled: !!address,
    },
  });

  const { bonds } = useAvailableBonds();
  const myBonds =
    data
      ?.map((balance, index) => ({
        ...bonds[index],
        balance: balance.result || BigInt(0),
      }))
      .filter((bond) => bond.balance > BigInt(0)) || [];

  return {
    myBonds,
    isPending,
    error,
  };
};

import { abi as zcpAbi } from "@/abi/zero-coupon-bond";
import {
  ZERO_COUPON_BOND_ADDRESS_0,
  ZERO_COUPON_BOND_ADDRESS_1,
  ZERO_COUPON_BOND_ADDRESS_2,
} from "@/constants/contract";
import { formatEther } from "viem";
import { useReadContracts } from "wagmi";
import { Bond } from "../types";

const ALL_ADDRESSES = [
  ZERO_COUPON_BOND_ADDRESS_0,
  ZERO_COUPON_BOND_ADDRESS_1,
  ZERO_COUPON_BOND_ADDRESS_2,
] as const as `0x${string}`[];

export const useAvailableBonds = (): {
  bonds: Bond[];
  isPending: boolean;
  error: Error | null;
} => {
  const contracts = ALL_ADDRESSES.map((address) => [
    {
      address,
      abi: zcpAbi,
      functionName: "marginRatio",
    },
    {
      address,
      abi: zcpAbi,
      functionName: "totalSupply",
    },
    {
      address,
      abi: zcpAbi,
      functionName: "maturity",
    },
    {
      address,
      abi: zcpAbi,
      functionName: "name",
    },
  ]).flat();

  const { data, error, isPending } = useReadContracts({
    contracts,
  });

  // Transform the raw data into structured bond information
  const bonds = ALL_ADDRESSES.map((address, index) => {
    const baseIndex = index * 4; // Since we have 4 contract calls per address
    return {
      address,
      marginRatio: Number(data?.[baseIndex].result as bigint) / 100,
      totalSupply: data?.[baseIndex + 1].result
        ? formatEther(data?.[baseIndex + 1].result as bigint)
        : "0", // 18 decimals
      maturity: Number(data?.[baseIndex + 2].result as bigint) * 1000, // timestamp
      name: String(data?.[baseIndex + 3].result),
      price: 0.9 + Math.random() * 0.1, // Random price
    };
  });

  return {
    bonds,
    isPending,
    error,
  };
};

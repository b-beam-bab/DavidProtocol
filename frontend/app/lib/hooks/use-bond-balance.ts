import { abi as zcpAbi } from "@/abi/zero-coupon-bond";
import {
  ZERO_COUPON_BOND_ADDRESS_0,
  ZERO_COUPON_BOND_ADDRESS_1,
  ZERO_COUPON_BOND_ADDRESS_2,
} from "@/constants/contract";
import { useReadContracts } from "wagmi";

export const useBondBalance = (address: `0x${string}` | undefined) => {
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

  const sumBalance = data?.reduce((acc, { result }) => {
    if (!result) return acc;
    return acc + result;
  }, BigInt(0));

  return {
    balance: sumBalance,
    isPending,
    error,
  };
};

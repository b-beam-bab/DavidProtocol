import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
  useBalance,
} from "wagmi";
import { abi as smmAbi } from "@/abi/staking-module-manager";
import { STAKING_MODULE_MANAGER_ADDRESS } from "@/constants/contract";
import { zeroAddress } from "viem";

export const useStakingModule = (address: `0x${string}` | undefined) => {
  const { data: simulateData, refetch } = useSimulateContract({
    address: STAKING_MODULE_MANAGER_ADDRESS,
    abi: smmAbi,
    functionName: "getStakingModule",
    args: address ? [address, "0x"] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: hash, isPending, writeContract } = useWriteContract();

  const getStakingModule = async () => {
    if (!address) return;

    writeContract({
      address: STAKING_MODULE_MANAGER_ADDRESS,
      abi: smmAbi,
      functionName: "getStakingModule",
      args: [address, "0x"],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    stakingModuleAddress: simulateData?.result, // This will contain the expected return value
    getStakingModule,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    refetch,
  };
};

export const useDepositAmount = (userAddress: `0x${string}` | undefined) => {
  const { stakingModuleAddress } = useStakingModule(userAddress);

  const { data: balance, refetch } = useBalance({
    address: stakingModuleAddress,
    query: {
      enabled: !!stakingModuleAddress && stakingModuleAddress !== zeroAddress,
    },
  });

  return {
    balance: balance?.value ?? BigInt(0),
    stakingModuleAddress,
    refetch,
  };
};

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
  useBalance,
} from "wagmi";
import { abi as smmAbi } from "@/abi/staking-module-manager";
import { STAKING_MODULE_MANAGER_ADDRESS } from "@/constants/contract";

export const useStakingModule = (address: `0x${string}` | undefined) => {
  const { data: simulateData } = useSimulateContract({
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
  };
};

export const useDepositAmount = (userAddress: `0x${string}` | undefined) => {
  const { stakingModuleAddress } = useStakingModule(userAddress);

  console.log("Staking module address", stakingModuleAddress);

  const { data: balance } = useBalance({
    address: stakingModuleAddress,
    query: {
      enabled: !!stakingModuleAddress,
    },
  });

  return {
    balance: balance?.value ?? BigInt(0),
    stakingModuleAddress,
  };
};

import { sepolia, unichainSepolia } from "viem/chains";

export type Bond = {
  id: number;
  name: string;
  network: typeof sepolia | typeof unichainSepolia;
  maturityDate: number;
  liquidity: number;
  maturityValue: string;
  fixedAPY: number;
  price: number;
};

export type TransactionState = "idle" | "loading" | "success" | "error";

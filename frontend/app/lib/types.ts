import { sepolia, unichainSepolia } from "viem/chains";

export type Bond = {
  id: number;
  name: string;
  network: typeof sepolia | typeof unichainSepolia;
  maturityDate: number;
  liquidity: number;
  totalTVL: number;
  maturityValue: string;
  fixedAPY: number;
  price: number;
};

export type Bond = {
  address: `0x${string}`;
  marginRatio: number;
  name: string;
  maturity: number;
  totalSupply: string;
  price: number;
};

export type TransactionState = "idle" | "loading" | "success" | "error";

export const abi = [
  {
    type: "function",
    name: "getStakingModule",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "pubkey", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "stake",
    inputs: [
      { name: "pubkey", type: "bytes", internalType: "bytes" },
      { name: "signature", type: "bytes", internalType: "bytes" },
      {
        name: "depositDataRoot",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
] as const;

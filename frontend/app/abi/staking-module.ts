export const abi = [
  {
    type: "function",
    name: "mintBond",
    inputs: [
      {
        name: "zcbContract",
        type: "address",
        internalType: "contract IZeroCouponBond",
      },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

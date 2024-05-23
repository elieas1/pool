export const usdcAddress = "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814";

export const usdcAbi = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

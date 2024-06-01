"use client";
import { Button } from "@nextui-org/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import React from "react";
import { useAccount } from "wagmi";

type Props = {};

const Web3Button = (props: Props) => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  return (
    <Button
      style={{ backgroundColor: "#7878fe", color: "white" }}
      onClick={() => open()}
    >
      {address
        ? `${address?.slice(0, 7)}...${address.slice(address.length - 5)}`
        : "Connect Wallet"}
    </Button>
  );
};

export default Web3Button;

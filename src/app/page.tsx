"use client";
import CardItem from "@/components/card/Card";
import EmptySpace from "@/components/emptySpace/EmptySpace";
import useGetInfo from "@/hooks/useGetInfo";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { Button, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { totalDeposited } = useGetInfo();
  const { pendingAmount, depositedAmount, isSuccesUserData } = useGetUserInfo();

  const { push } = useRouter();

  const navigateToPool = () => {
    push("/pool");
  };

  return (
    <Skeleton style={{ borderRadius: "25px" }} isLoaded>
      <CardItem
        title="Numerical Stable Engine V1"
        imageSource="/vault.png"
        totalDeposited={totalDeposited}
        apr={0}
        onPress={navigateToPool}
        userDeposit={depositedAmount + pendingAmount}
      />
    </Skeleton>
  );
}

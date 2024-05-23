"use client";
import CardItem from "@/components/card/Card";
import EmptySpace from "@/components/emptySpace/EmptySpace";
import useGetInfo from "@/hooks/useGetInfo";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { totalDeposited } = useGetInfo();
  const { pendingAmount, depositedAmount, isSuccesUserData } = useGetUserInfo();

  const { push } = useRouter();

  const navigateToPool = () => {
    push("/pool");
  };

  return (
    <main className="flex flex-col items-center">
      <EmptySpace spaceTop={50} />
      <Skeleton style={{ borderRadius: "25px" }} isLoaded={isSuccesUserData}>
        <CardItem
          title="Name goes here"
          imageSource="/image.avif"
          totalDeposited={totalDeposited}
          apr={0}
          onPress={navigateToPool}
          userDeposit={depositedAmount + pendingAmount}
        />
      </Skeleton>
    </main>
  );
}

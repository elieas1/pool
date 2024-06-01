"use client";
import CardItem from "@/components/card/Card";
import useGetInfo from "@/hooks/useGetInfo";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { totalDeposited } = useGetInfo();
  const { pendingAmount, depositedAmount, isLoadingUserData } =
    useGetUserInfo();

  const { push } = useRouter();

  const navigateToPool = () => {
    push("/pool");
  };

  return (
    <Skeleton style={{ borderRadius: "25px" }} isLoaded={!isLoadingUserData}>
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

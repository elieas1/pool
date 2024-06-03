"use client";
import CardItem from "@/components/card/Card";
import useGetInfo from "@/hooks/useGetInfo";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { totalDeposited, rewardHistory } = useGetInfo();
  const { pendingAmount, depositedAmount, isLoadingUserData } =
    useGetUserInfo();

  const { push } = useRouter();

  const navigateToPool = () => {
    push("/pool");
  };

  const lastEpoch = rewardHistory?.[rewardHistory.length - 1];

  const { adminBalance, epochTime, reward, totalDeposit } = lastEpoch ?? {};
  const apr =
    rewardHistory?.length! > 0
      ? ((adminBalance! + reward! - totalDeposit!) / totalDeposit!) *
        (365 / (epochTime! / 86400)) *
        100
      : 0;

  return (
    <Skeleton style={{ borderRadius: "25px" }} isLoaded={!isLoadingUserData}>
      <CardItem
        title="Numerical Stable Engine V1"
        imageSource="/vault.png"
        totalDeposited={totalDeposited}
        apr={apr}
        onPress={navigateToPool}
        userDeposit={depositedAmount + pendingAmount}
      />
    </Skeleton>
  );
}

"use client";
import CardItem from "@/components/card/Card";
import useGetInfo from "@/hooks/useGetInfo";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { formatUsdc } from "@/utils/functions";
import { useRouter } from "next/navigation";

export default function Home() {
  const { totalDeposited, rewardHistory } = useGetInfo();
  const { pendingAmount, depositedAmount } = useGetUserInfo();

  const { push } = useRouter();

  const navigateToPool = () => {
    push("/pool");
  };

  const lastEpoch = rewardHistory?.[rewardHistory.length - 1];

  const { adminBalance, epochTime, totalDeposit } = lastEpoch ?? {};

  const formattedAdminBalance = Number(adminBalance!);
  const formattedTotalDeposit = formatUsdc(Number(totalDeposit!));

  const apr =
    rewardHistory?.length! > 0
      ? ((formattedAdminBalance - formattedTotalDeposit) /
          formattedTotalDeposit) *
        (365 / (Number(epochTime!) / 86400)) *
        100
      : 0;

  return (
    <CardItem
      title="Numerical Stable Engine V1"
      imageSource="/vault.png"
      totalDeposited={totalDeposited}
      apr={apr}
      onPress={navigateToPool}
      userDeposit={depositedAmount + pendingAmount}
    />
  );
}

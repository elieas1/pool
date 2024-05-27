"use client";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import React, { useEffect } from "react";
import Deposits from "./components/deposits/Deposits";
import useGetInfo from "@/hooks/useGetInfo";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import InfoTabs from "./components/tabs/InfoTabs";
import { useAccount } from "wagmi";
import LineChart from "./components/chart/Chart";
import classes from "./styles.module.css";
import useGetUsdcBalance from "@/hooks/useGetUsdcBalance";
import { formatUsdc } from "@/utils/functions";
import useDepositActions from "@/hooks/useDepositActions";
import useRewards from "@/hooks/useRewards";
import useWithdrawDeposit from "@/hooks/useWithdrawDeposit";

const Page = () => {
  const { address } = useAccount();
  const {
    totalDeposited,
    rewardHistory,
    withdrawRequests,
    refetchInfo,
    isSuccessInfo,
  } = useGetInfo();

  const { userBalance, refetchBalances, isSuccessLoadingBalance } =
    useGetUsdcBalance({
      address,
    });

  const {
    deposit,
    isLoadingDeposit,
    isSuccessDeposit,
    isLoadingApprove,
    isSuccessApprove,
  } = useDepositActions();

  const {
    claimRewards,
    isLoadingClaimRewards,
    isSuccessClaimRewards,
    reDeposit,
    isLoadingReDeposit,
    isSuccessReDeposit,
  } = useRewards();

  const {
    requestWithdraw,
    isLoadingWithdrawRequest,
    isSuccessWithdrawRequest,
    cancelWithdraw,
    isLoadingCancelWithdraw,
    isSuccessCancelWithdraw,
    withdraw,
    isLoadingWithdraw,
    isSuccessWithdraw,
  } = useWithdrawDeposit();

  const {
    isSuccesUserData,
    pendingAmount,
    depositedAmount,
    claimableRewards,
    claimedRewards,
    withdrawableAmount,
    withdrawApproved,
    refetchUserData,
    withrawalRequestAmount,
  } = useGetUserInfo();

  useEffect(() => {
    if (isSuccessWithdrawRequest || isSuccessCancelWithdraw) {
      refetchInfo();
    }

    if (isSuccessWithdraw) {
      refetchBalances();
      refetchUserData();
      refetchInfo();
    }
  }, [
    isSuccessCancelWithdraw,
    isSuccessWithdraw,
    isSuccessWithdrawRequest,
    refetchBalances,
    refetchInfo,
    refetchUserData,
  ]);

  useEffect(() => {
    if (isSuccessDeposit || isSuccessClaimRewards || isSuccessReDeposit) {
      refetchBalances();
      refetchUserData();
    }
  }, [
    isSuccessClaimRewards,
    isSuccessDeposit,
    isSuccessReDeposit,
    refetchBalances,
    refetchUserData,
  ]);

  const isHistoryAvailable = rewardHistory && rewardHistory?.length > 0;

  const getApr = () => {
    if (isHistoryAvailable) {
      const { epochTime, reward, totalDeposit, adminBalance } =
        rewardHistory[rewardHistory.length - 1];
      const formattedTotalDeposit = formatUsdc(Number(totalDeposit));
      const formattedReward = formatUsdc(Number(reward));
      const formattedAdminBalance = formatUsdc(Number(adminBalance));
      const formattedEpochTime = Number(epochTime) / 86400;
      const apr =
        ((formattedAdminBalance - formattedTotalDeposit) /
          formattedTotalDeposit) *
        (365 / formattedEpochTime) *
        100;
      return apr;
    }

    return 0;
  };

  const hasUserRequestedWithdraw = !!address
    ? withdrawRequests?.includes(address)
    : false;

  return (
    <div className={`${classes.wrapper}`}>
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="rounded-medium" isLoaded={isSuccessLoadingBalance}>
          <Card style={{ backgroundColor: "#2E334B" }} isBlurred>
            <CardBody>
              <div
                style={{ color: "white" }}
                className="flex justify-between p-5"
              >
                <div>My USDC balance</div>
                <div>{userBalance} USDC</div>
              </div>
            </CardBody>
          </Card>
        </Skeleton>
        <Skeleton className="rounded-medium" isLoaded={isSuccesUserData}>
          <Deposits approved={depositedAmount} pending={pendingAmount} />
        </Skeleton>
        <Skeleton className="rounded-medium" isLoaded={isSuccesUserData}>
          <InfoTabs
            claimableRewards={claimableRewards}
            claimedRewards={claimedRewards}
            hasUserRequestedWithdraw={hasUserRequestedWithdraw!}
            depositedAmount={depositedAmount}
            withdrawApproved={withdrawApproved!}
            withdrawableAmount={withdrawableAmount}
            pendingAmount={pendingAmount}
            isSuccessApprove={isSuccessApprove}
            onDeposit={deposit}
            isLoadingDeposit={isLoadingDeposit || isLoadingApprove}
            onClaim={claimRewards}
            isLoadingClaim={isLoadingClaimRewards}
            onReDeposit={reDeposit}
            isLoadingReDeposit={isLoadingReDeposit}
            onRequestWithdraw={requestWithdraw}
            isLoadingRequestWithdraw={isLoadingWithdrawRequest}
            onCancelWithdraw={cancelWithdraw}
            isLoadingCancelWithdraw={isLoadingCancelWithdraw}
            onWithdraw={withdraw}
            isLoadingWithdraw={isLoadingWithdraw}
            userBalance={userBalance}
            withrawalRequestAmount={withrawalRequestAmount}
          />
        </Skeleton>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="rounded-medium" isLoaded={isSuccessInfo}>
          <Card style={{ backgroundColor: "#2E334B" }} isBlurred>
            <CardBody style={{ color: "white" }}>
              <div className="flex justify-between p-5">
                <div>Total Deposits:</div>
                <div>{totalDeposited} USDC</div>
              </div>
              <div className="flex justify-between p-5">
                <div>APR:</div>
                <div>{getApr()} %</div>
              </div>
            </CardBody>
          </Card>
        </Skeleton>
        <LineChart array={rewardHistory} />
      </div>
    </div>
  );
};

export default Page;

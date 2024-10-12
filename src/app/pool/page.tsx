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
import CountdownTimer from "@/components/countdownTimer/CountdownTimer";
import { maxUsdc } from "@/utils/constant";

const Page = () => {
  const { address } = useAccount();
  const {
    totalDeposited,
    rewardHistory,
    withdrawRequests,
    refetchInfo,
    isLoadingInfo,
    lastEpochTime,
    currentEpoch,
    totalPending,
  } = useGetInfo();

  const { userBalance, refetchBalances, isLoadingBalances } = useGetUsdcBalance(
    {
      address,
    }
  );

  const {
    deposit,
    isLoadingDeposit,
    isSuccessDeposit,
    isLoadingApprove,
    isLoadingApproveHash,
    isSuccessApprove,
    depositAmount,
    isLoadingDepositHash,
  } = useDepositActions({ address });

  const {
    claimRewards,
    isLoadingClaimRewardsHash,
    isSuccessClaimRewards,
    reDeposit,
    isLoadingRedeposit,
    isLoadingRedepositHash,
    isSuccessRedeposit,
    isLoadingClaimRewards,
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
    pendingAmount,
    depositedAmount,
    claimableRewards,
    claimedRewards,
    withdrawableAmount,
    withdrawApproved,
    refetchUserData,
    withrawalRequestAmount,
    isLoadingUserData,
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
    if (isSuccessDeposit || isSuccessClaimRewards || isSuccessRedeposit) {
      refetchBalances();
      refetchUserData();
    }
  }, [
    isSuccessClaimRewards,
    isSuccessDeposit,
    isSuccessRedeposit,
    refetchBalances,
    refetchUserData,
  ]);

  const isHistoryAvailable = rewardHistory && rewardHistory?.length > 0;

  const getApr = () => {
    if (isHistoryAvailable) {
      const { epochTime, totalDeposit, adminBalance } =
        rewardHistory[rewardHistory.length - 1];

      const formattedTotalDeposit = formatUsdc(Number(totalDeposit));
      const formattedAdminBalance = Number(adminBalance);
      const formattedEpochTime = Number(epochTime) / 86400;

      const apr =
        ((formattedAdminBalance - formattedTotalDeposit) /
          formattedTotalDeposit) *
        (365 / formattedEpochTime) *
        100;

      return apr.toFixed(2);
    }

    return 0;
  };

  const hasUserRequestedWithdraw = !!address
    ? withdrawRequests?.includes(address)
    : false;

  return (
    <div className={`${classes.wrapper}`}>
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton
          className="rounded-medium"
          isLoaded={!isLoadingBalances || !address}
        >
          <Card style={{ backgroundColor: "#2E334B" }} isBlurred>
            <CardBody>
              <div
                style={{ color: "white" }}
                className="flex justify-between p-5"
              >
                <div>My USDC balance</div>
                <div>{userBalance.toFixed(2)} USDC</div>
              </div>
            </CardBody>
          </Card>
        </Skeleton>
        <Skeleton
          className="rounded-medium"
          isLoaded={!isLoadingUserData || !address}
        >
          <Deposits approved={depositedAmount} pending={pendingAmount} />
        </Skeleton>
        <Skeleton
          className="rounded-medium"
          isLoaded={!isLoadingUserData || !address}
        >
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
            isLoadingDeposit={
              isLoadingDeposit ||
              isLoadingApprove ||
              isLoadingDepositHash ||
              isLoadingApproveHash
            }
            onClaim={claimRewards}
            isLoadingClaim={isLoadingClaimRewardsHash || isLoadingClaimRewards}
            onReDeposit={reDeposit}
            isLoadingReDeposit={isLoadingRedepositHash || isLoadingRedeposit}
            onRequestWithdraw={requestWithdraw}
            isLoadingRequestWithdraw={isLoadingWithdrawRequest}
            onCancelWithdraw={cancelWithdraw}
            isLoadingCancelWithdraw={isLoadingCancelWithdraw}
            onWithdraw={withdraw}
            isLoadingWithdraw={isLoadingWithdraw}
            userBalance={userBalance}
            withrawalRequestAmount={withrawalRequestAmount}
            depositAmount={depositAmount}
            totalPending={totalPending}
            totalDeposit={totalDeposited}
          />
        </Skeleton>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton
          className="rounded-medium"
          isLoaded={!isLoadingInfo || !address}
        >
          <Card style={{ backgroundColor: "#2E334B" }} isBlurred>
            <CardBody style={{ color: "white" }}>
              <div className="flex justify-between p-5">
                <div>TVL</div>
                <div>
                  {(totalDeposited + totalPending).toFixed(0)}/ {maxUsdc} USDC
                </div>
              </div>
              <div className="flex justify-between p-5">
                <div>APR</div>
                <div>{getApr()} %</div>
              </div>
              <div className="flex justify-between p-5">
                <div>Current Epoch</div>
                <div>{currentEpoch === 0 ? "Pending" : currentEpoch}</div>
              </div>
              {currentEpoch > 0 && (
                <CountdownTimer initialTimestamp={lastEpochTime} />
              )}
            </CardBody>
          </Card>
        </Skeleton>
        <LineChart array={rewardHistory} />
      </div>
    </div>
  );
};

export default Page;

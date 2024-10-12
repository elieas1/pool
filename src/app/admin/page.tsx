"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import classes from "./classes.module.css";
import { Button, Card, CardBody, Input, Skeleton } from "@nextui-org/react";
import useGetAdminData from "@/hooks/useGetAdminData";
import useGetUsdcBalance from "@/hooks/useGetUsdcBalance";
import useGetUserDeposit from "@/hooks/useGetUserDeposit";
import useAdminActions from "@/hooks/useAdminActions";
import useGetInfo from "@/hooks/useGetInfo";

const Page = () => {
  const [searchValue, setSearchValue] = useState("");
  const [rewardValue, setRewardValue] = useState(0);
  const [adminWalletValue, setAdminWalletValue] = useState(0);

  const { address } = useAccount();

  const { contractBalance, userBalance } = useGetUsdcBalance({ address });

  const { currentEpoch } = useGetInfo();

  const {
    amount,
    claimableRewards,
    claimedRewards,
    initialDepositTime,
    isRefetching,
    pendingAmount,
    refetch,
    reDepositTime,
    withdrawApproved,
    withdrawableAmount,
    isLoadingUserDeposit,
    isSuccessUserDeposit,
  } = useGetUserDeposit({ searchValue });

  const {
    ownerAddress,
    totalDeposited,
    withdrawRequests,
    totalWithdrawAmount,
    successfullyDeposited,
    awaitingApproval,
    refetchAdminData,
    totalPending,
  } = useGetAdminData();

  const {
    approveWithdraw,
    isLoadingApproveWithdraw,
    distributeRewards,
    isLoadingDistributeRewards,
    startNewCycle,
    isLoadingNewCycle,
    isLoadingNewCycleHash,
    isLoadingApproveWithdrawHash,
    isLoadingDistributeRewardsHash,
  } = useAdminActions({ refetchAdminData, rewardValue, adminWalletValue });

  const isAdmin = address === ownerAddress;

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const getUserInfo = () => {
    refetch();
  };

  const handleStartNewCycle = () => {
    startNewCycle();
  };

  const handleDistributeRewards = () => {
    distributeRewards();
  };

  const handleApproveWithdraw = () => {
    approveWithdraw();
  };

  const handleChangeReward = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRewardValue(parseInt(event.target.value) || 0);
  };

  const handleChangeAdminWallet = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdminWalletValue(parseInt(event.target.value) || 0);
  };

  return (
    <div className={classes.wrapper}>
      <div className="w-[350px]">
        <Skeleton style={{ borderRadius: "25px" }} isLoaded={isAdmin}>
          <Card isBlurred>
            <CardBody>
              <div className="flex justify-between">
                <div>Contract Balance:</div>
                <div>{contractBalance} USDC</div>
              </div>
              <div className="flex justify-between">
                <div>My Balance:</div>
                <div>{userBalance} USDC</div>
              </div>
            </CardBody>
          </Card>
        </Skeleton>
      </div>
      <div className="flex justify-center flex-wrap gap-3">
        <Skeleton style={{ borderRadius: "25px" }} isLoaded={isAdmin}>
          <Card isBlurred>
            <CardBody className="flex flex-col justify-between">
              <div className="p-3">
                Total Deposited Amount: {totalDeposited} USDC
              </div>
              <div className="p-3">
                Deposited users amount: {successfullyDeposited?.length}{" "}
              </div>
              <div className="flex h-[60px] gap-2">
                <Input
                  value={rewardValue.toString()}
                  onChange={handleChangeReward}
                  label="Amount"
                />
                <Input
                  value={adminWalletValue.toString()}
                  onChange={handleChangeAdminWallet}
                  label="Admin Wallet"
                />
                <Button
                  className="text-wrap h-[%]"
                  onClick={handleDistributeRewards}
                  isDisabled={rewardValue === 0}
                  isLoading={
                    isLoadingDistributeRewards || isLoadingDistributeRewardsHash
                  }
                  variant="shadow"
                  color="warning"
                >
                  Distribute Rewards
                </Button>
              </div>
            </CardBody>
          </Card>
        </Skeleton>
        <Skeleton style={{ borderRadius: "25px" }} isLoaded={isAdmin}>
          <Card isBlurred>
            <CardBody className="flex flex-col justify-between">
              <div className="p-3">
                Withdraw Requests: {withdrawRequests?.length}
              </div>
              <div className="p-3">
                Withdraw Requests Amount: {totalWithdrawAmount} USDC
              </div>
              <div className="p-3">Withdraw Requests (users):</div>
              {withdrawRequests?.map((addr) => (
                <div key={addr}>{addr}</div>
              ))}
              <Button
                onClick={handleApproveWithdraw}
                isLoading={
                  isLoadingApproveWithdraw || isLoadingApproveWithdrawHash
                }
                variant="shadow"
                color="warning"
              >
                Approve Withdraw Requests
              </Button>
            </CardBody>
          </Card>
        </Skeleton>
        <Skeleton style={{ borderRadius: "25px" }} isLoaded={isAdmin}>
          <Card isBlurred>
            <CardBody className="flex flex-col justify-between">
              <div className="p-3">Current Epoch {currentEpoch}</div>
              <div className="p-3">
                Pending Requests {awaitingApproval?.length}
              </div>
              <div className="p-3">Pending Amount: {totalPending} USDC</div>
              <div className="p-3">Pending Requests (users):</div>
              {awaitingApproval?.map((addr) => (
                <div key={addr}>{addr}</div>
              ))}
              <Button
                isLoading={isLoadingNewCycle || isLoadingNewCycleHash}
                onClick={handleStartNewCycle}
                variant="shadow"
                color="warning"
              >
                Start New Cycle
              </Button>
            </CardBody>
          </Card>
        </Skeleton>
      </div>
      <Card isBlurred>
        <CardBody>
          <div className="flex gap-2 flex-1">
            <Input
              value={searchValue}
              onChange={onChangeSearch}
              placeholder="enter wallet"
            />
            <Button
              isLoading={isRefetching || isLoadingUserDeposit}
              onClick={getUserInfo}
              color="secondary"
            >
              Get Info
            </Button>
          </div>
          {isSuccessUserDeposit && (
            <div className="p-2">
              <div className="p-1">Deposited Amount: {Number(amount)} USDC</div>
              <div className="p-1">
                Pending Amount: {Number(pendingAmount)} USDC
              </div>

              <div className="p-1">
                Claimable Reward: {Number(claimableRewards)} USDC
              </div>
              <div className="p-1">
                Claimed Reward: {Number(claimedRewards)} USDC
              </div>

              <div className="p-1">
                Initial Deposit Time:{" "}
                {new Date(Number(initialDepositTime)).toUTCString()}
              </div>
              <div className="p-1">
                Re-deposit Time: {new Date(Number(reDepositTime)).toUTCString()}
              </div>

              <div className="p-1">
                Withdraw Approved: {`${withdrawApproved}`}
              </div>
              <div className="p-1">
                Withdrawable Amount: {Number(withdrawableAmount)} USDC
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Page;

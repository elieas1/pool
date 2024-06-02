"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAccount } from "wagmi";
import classes from "./classes.module.css";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import useGetAdminData from "@/hooks/useGetAdminData";
import useGetUsdcBalance from "@/hooks/useGetUsdcBalance";
import useGetUserDeposit from "@/hooks/useGetUserDeposit";
import useAdminActions from "@/hooks/useAdminActions";

const Page = () => {
  const [searchValue, setSearchValue] = useState("");

  const { address } = useAccount();
  const { replace } = useRouter();

  const { contractBalance, userBalance } = useGetUsdcBalance({ address });

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
    isSuccessAdminData,
    isErrorAdminData,
  } = useGetAdminData();

  const {
    approveWithdraw,
    isLoadingApproveWithdraw,
    distributeRewards,
    isLoadingDistributeRewards,
    startNewCycle,
    isLoadingNewCycle,
  } = useAdminActions({ refetchAdminData });

  useLayoutEffect(() => {
    if (isSuccessAdminData) {
      if (address !== ownerAddress || !address) {
        replace("/");
      }
    }

    if (isErrorAdminData) {
      replace("/");
    }
  }, [address, isErrorAdminData, isSuccessAdminData, ownerAddress, replace]);

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

  return (
    <div className={classes.wrapper}>
      <div className="w-[350px]">
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
      </div>
      <div className="flex justify-center flex-wrap gap-3">
        <Card isBlurred>
          <CardBody className="flex flex-col justify-between">
            <div className="p-3">
              Total Deposited Amount: {totalDeposited} USDC
            </div>
            <div className="p-3">
              Deposited users amount: {successfullyDeposited?.length}{" "}
            </div>
            <Button
              onClick={handleDistributeRewards}
              isLoading={isLoadingDistributeRewards}
              variant="shadow"
              color="warning"
            >
              Distribute Rewards
            </Button>
          </CardBody>
        </Card>
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
              isLoading={isLoadingApproveWithdraw}
              variant="shadow"
              color="warning"
            >
              Approve Withdraw Requests
            </Button>
          </CardBody>
        </Card>
        <Card isBlurred>
          <CardBody className="flex flex-col justify-between">
            <div className="p-3">
              Pending Requests: {awaitingApproval?.length}
            </div>
            <div className="p-3">Pending Requests (users):</div>
            {awaitingApproval?.map((addr) => (
              <div key={addr}>{addr}</div>
            ))}
            <Button
              isLoading={isLoadingNewCycle}
              onClick={handleStartNewCycle}
              variant="shadow"
              color="warning"
            >
              Start New Cycle
            </Button>
          </CardBody>
        </Card>
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

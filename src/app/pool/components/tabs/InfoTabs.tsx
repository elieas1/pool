import EmptySpace from "@/components/emptySpace/EmptySpace";
import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import classes from "./InfoTabs.module.css";
import { parseUsdc } from "@/utils/functions";
import PercentButton from "@/components/percentButton/PercentButton";

type Props = {
  claimedRewards: number;
  claimableRewards: number;
  userBalance: number;
  hasUserRequestedWithdraw: boolean;
  depositedAmount: number;
  pendingAmount: number;
  withdrawableAmount: number;
  withdrawApproved: boolean;
  onDeposit: (number: number) => void;
  onClaim: () => void;
  isLoadingDeposit: boolean;
  isLoadingClaim: boolean;
  onReDeposit: () => void;
  onRequestWithdraw: () => void;
  onCancelWithdraw: () => void;
  onWithdraw: (amount: number) => void;
  isLoadingReDeposit: boolean;
  isLoadingRequestWithdraw: boolean;
  isLoadingCancelWithdraw: boolean;
  isLoadingWithdraw: boolean;
  isSuccessApprove: boolean;
  withrawalRequestAmount: number;
};

const InfoTabs = ({
  claimedRewards,
  claimableRewards,
  hasUserRequestedWithdraw,
  depositedAmount,
  pendingAmount,
  withdrawableAmount,
  withdrawApproved,
  onDeposit,
  isLoadingDeposit,
  onClaim,
  isLoadingClaim,
  onReDeposit,
  isLoadingReDeposit,
  onRequestWithdraw,
  isLoadingRequestWithdraw,
  onCancelWithdraw,
  isLoadingCancelWithdraw,
  onWithdraw,
  isLoadingWithdraw,
  isSuccessApprove,
  userBalance,
  withrawalRequestAmount,
}: Props) => {
  const [amount, setAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const totalAmount = depositedAmount + pendingAmount;

  useEffect(() => {
    if (isSuccessApprove) {
      onDeposit(parseUsdc(amount));
    }
  }, [amount, isSuccessApprove, onDeposit]);

  const getWithdrawMessage = () => {
    if (hasUserRequestedWithdraw) {
      return (
        <div className="flex justify-between p-5">
          <div>Pending Amount</div>
          <div>{withrawalRequestAmount} USDC</div>
        </div>
      );
    }

    if (withdrawApproved) {
      return (
        <div className="flex justify-between p-5">
          <div>Withdrawable amount</div>
          <div>{withdrawableAmount} USDC</div>
        </div>
      );
    }
    return (
      <div className="flex justify-between p-5">
        <div>My total deposit</div>
        <div>{totalAmount} USDC</div>
      </div>
    );
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(event.target.value));
  };

  const handleWithdrawClick = () => {
    if (hasUserRequestedWithdraw) {
      onCancelWithdraw();
      return;
    }

    if (withdrawApproved) {
      onWithdraw(withdrawAmount);
      return;
    }

    onRequestWithdraw();
    return;
  };

  return (
    <Card style={{ backgroundColor: "#2E334B" }} isBlurred>
      <CardBody>
        <Tabs fullWidth className="w-full">
          <Tab key="deposit" title="Deposit">
            <div style={{ color: "white" }} className="flex gap-2">
              <div className="w-full">
                <Input
                  isRequired
                  type="number"
                  label="Amount"
                  defaultValue="0"
                  fullWidth
                  value={amount + ""}
                  className="h-[60px]"
                  onChange={handleChangeAmount}
                />
                <EmptySpace spaceTop={5} />
                <div className="flex gap-1 items-center">
                  <PercentButton
                    onClick={() => setAmount(userBalance * 0.25)}
                    percent={25}
                  />
                  <PercentButton
                    onClick={() => setAmount(userBalance * 0.5)}
                    percent={50}
                  />
                  <PercentButton
                    onClick={() => setAmount(userBalance * 0.75)}
                    percent={75}
                  />
                  <PercentButton
                    onClick={() => setAmount(userBalance)}
                    percent={100}
                  />
                </div>
              </div>
              <Button
                onClick={() => onDeposit(parseUsdc(amount))}
                className="learnMore w-[150px] h-[57px]"
                isLoading={isLoadingDeposit}
                isDisabled={amount === 0}
              >
                Deposit
              </Button>
            </div>
            <div className={classes.note}>
              Note: Deposited amount will remain as pending untill the new epoch
              starts
            </div>
          </Tab>
          <Tab key="withdraw" title="Withdraw">
            <div style={{ color: "white" }}>
              {getWithdrawMessage()}
              <EmptySpace spaceTop={10} />
              <div className="flex gap-2">
                <div className="w-full">
                  <Input
                    isRequired
                    type="number"
                    label="Amount"
                    defaultValue="0"
                    fullWidth
                    value={withdrawAmount + ""}
                    max={totalAmount - withrawalRequestAmount}
                    className="h-[60px]"
                    onChange={handleChangeAmount}
                  />
                  <EmptySpace spaceTop={5} />
                  <div className="flex gap-1 items-center">
                    <PercentButton
                      onClick={() =>
                        setWithdrawAmount(
                          (totalAmount - withrawalRequestAmount) * 0.25
                        )
                      }
                      percent={25}
                    />
                    <PercentButton
                      onClick={() =>
                        setWithdrawAmount(
                          (totalAmount - withrawalRequestAmount) * 0.5
                        )
                      }
                      percent={50}
                    />
                    <PercentButton
                      onClick={() =>
                        setWithdrawAmount(
                          (totalAmount - withrawalRequestAmount) * 0.75
                        )
                      }
                      percent={75}
                    />
                    <PercentButton
                      onClick={() =>
                        setWithdrawAmount(totalAmount - withrawalRequestAmount)
                      }
                      percent={100}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleWithdrawClick}
                  className="learnMore w-[150px] h-[57px]"
                  isLoading={
                    isLoadingRequestWithdraw ||
                    isLoadingCancelWithdraw ||
                    isLoadingWithdraw
                  }
                  isDisabled={totalAmount === 0 || withdrawAmount === 0}
                >
                  {hasUserRequestedWithdraw || withdrawApproved
                    ? "Withdraw"
                    : "Request Withdraw"}
                </Button>
              </div>
            </div>
          </Tab>
          <Tab key="claim" title="Claim">
            <div style={{ color: "white" }}>
              <div className="flex justify-between p-5">
                <div>Claimed Rewards</div>
                <div>{claimedRewards} USDC</div>
              </div>
              <div className="flex justify-between p-5">
                <div>
                  <div>Claimable Rewards</div>
                  <EmptySpace spaceTop={10} />
                  <div className="flex gap-3">
                    <Button
                      isDisabled={claimableRewards === 0}
                      variant="shadow"
                      color="success"
                      style={{ color: "white" }}
                      isLoading={isLoadingClaim}
                      onClick={onClaim}
                    >
                      Claim
                    </Button>
                    <Button
                      isDisabled={
                        claimableRewards === 0 || hasUserRequestedWithdraw
                      }
                      variant="shadow"
                      style={{ color: "white", backgroundColor: "#7878fe" }}
                      isLoading={isLoadingReDeposit}
                      onClick={onReDeposit}
                    >
                      Deposit
                    </Button>
                  </div>
                </div>
                <div>{claimableRewards} USDC</div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default InfoTabs;

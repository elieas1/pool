import EmptySpace from "@/components/emptySpace/EmptySpace";
import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import React, { useState } from "react";
import classes from "./InfoTabs.module.css";
import { parseUsdc } from "@/utils/functions";

type Props = {
  claimedRewards: number;
  claimableRewards: number;
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
  onWithdraw: () => void;
  isLoadingReDeposit: boolean;
  isLoadingRequestWithdraw: boolean;
  isLoadingCancelWithdraw: boolean;
  isLoadingWithdraw: boolean;
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
}: Props) => {
  const [amount, setAmount] = useState(0);
  const totalAmount = depositedAmount + pendingAmount;

  const getWithdrawMessage = () => {
    if (hasUserRequestedWithdraw) {
      return (
        <div className="flex justify-between p-5">
          <div>Pending Amount</div>
          <div>{depositedAmount + pendingAmount} USDC</div>
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
      onWithdraw();
      return;
    }

    onRequestWithdraw();
    return;
  };

  return (
    <Card isBlurred>
      <CardBody>
        <Tabs fullWidth className="w-full">
          <Tab key="deposit" title="Deposit">
            <div className="flex gap-2">
              <Input
                isRequired
                type="number"
                label="Amount"
                defaultValue="0"
                max={1000}
                value={amount + ""}
                className="max-w-xs"
                onChange={handleChangeAmount}
              />
              <Button
                onClick={() => onDeposit(parseUsdc(amount))}
                variant="shadow"
                className="h-auto"
                color="primary"
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
            {getWithdrawMessage()}
            <EmptySpace spaceTop={10} />
            <div>
              <Button
                variant="shadow"
                isDisabled={hasUserRequestedWithdraw || totalAmount === 0}
                color="danger"
                onClick={handleWithdrawClick}
                isLoading={
                  isLoadingRequestWithdraw ||
                  isLoadingCancelWithdraw ||
                  isLoadingWithdraw
                }
              >
                {hasUserRequestedWithdraw || withdrawApproved
                  ? "Withdraw"
                  : "Request Withdraw"}
              </Button>
            </div>
          </Tab>
          <Tab key="claim" title="Claim">
            <div>
              <div className="flex justify-between p-5">
                <div>Claimed Rewards:</div>
                <div>{claimedRewards} USDC</div>
              </div>
              <div className="flex justify-between p-5">
                <div>
                  <div>Claimable Rewards:</div>
                  <EmptySpace spaceTop={10} />
                  <div className="flex gap-3">
                    <Button
                      isDisabled={claimableRewards === 0}
                      variant="shadow"
                      color="success"
                      isLoading={isLoadingClaim}
                      onClick={onClaim}
                    >
                      Claim Now
                    </Button>
                    <Button
                      isDisabled={
                        claimableRewards === 0 || hasUserRequestedWithdraw
                      }
                      variant="shadow"
                      color="warning"
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

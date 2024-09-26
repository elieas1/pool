import { depositAbi, depositAddress } from "@/utils/depositContract";
import { handleError, parseUsdc } from "@/utils/functions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";

type props = {
  refetchAdminData: () => void;
  rewardValue: number;
  adminWalletValue: number;
};

const useAdminActions = ({
  refetchAdminData,
  rewardValue,
  adminWalletValue,
}: props) => {
  const {
    writeContract: startNewCycleFn,
    isPending: isLoadingNewCycle,
    isSuccess: isSuccessNewCycle,
    isError: isErrorNewCycle,
    error: newCycleError,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorNewCycle) {
      handleError(newCycleError.message);
    }
  }, [isErrorNewCycle, newCycleError]);

  useEffect(() => {
    if (isSuccessNewCycle) {
      toast.success("New epoch started successfully");
      refetchAdminData();
    }
  }, [isSuccessNewCycle, refetchAdminData]);

  const {
    writeContract: approveWithdrawFn,
    isPending: isLoadingApproveWithdraw,
    isSuccess: isSuccessApproveWithdraw,
    isError: isErrorApproveWithdraw,
    error: ApproveWithdrawError,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorApproveWithdraw) {
      handleError(ApproveWithdrawError.message);
    }
  }, [isErrorApproveWithdraw, ApproveWithdrawError]);

  useEffect(() => {
    if (isSuccessApproveWithdraw) {
      toast.success("Withdraw requests approved successfully");
      refetchAdminData();
    }
  }, [isSuccessApproveWithdraw, refetchAdminData]);

  const {
    writeContract: distributeRewardsFn,
    isPending: isLoadingDistributeRewards,
    isSuccess: isSuccessDistributeRewards,
    isError: isErrorDistributeRewards,
    error: distributeRewardsError,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorDistributeRewards) {
      handleError(distributeRewardsError.message);
    }
  }, [isErrorDistributeRewards, distributeRewardsError]);

  useEffect(() => {
    if (isSuccessDistributeRewards) {
      toast.success("Rewards distributed successfully");
      refetchAdminData();
    }
  }, [isSuccessDistributeRewards, refetchAdminData]);

  const startNewCycle = () => {
    startNewCycleFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "startNewCycle",
    });
  };

  const approveWithdraw = () => {
    approveWithdrawFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "approveWithdrawRequests",
    });
  };

  const distributeRewards = () => {
    distributeRewardsFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "distributeRewards",
      // adminWalletValue is in dollars, no need to parse it
      args: [parseUsdc(rewardValue), adminWalletValue],
    });
  };

  return {
    distributeRewards,
    approveWithdraw,
    startNewCycle,
    isLoadingNewCycle,
    isLoadingApproveWithdraw,
    isLoadingDistributeRewards,
  };
};

export default useAdminActions;

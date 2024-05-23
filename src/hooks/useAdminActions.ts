import { depositAbi, depositAddress } from "@/utils/depositContract";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";

type props = {
  refetchAdminData: () => void;
};

const useAdminActions = ({ refetchAdminData }: props) => {
  const {
    writeContract: startNewCycleFn,
    isPending: isLoadingNewCycle,
    isSuccess: isSuccessNewCycle,
    isError: isErrorNewCycle,
  } = useWriteContract();

  const {
    writeContract: approveWithdrawFn,
    isPending: isLoadingApproveWithdraw,
    isSuccess: isSuccessApproveWithdraw,
    isError: isErrorApproveWithdraw,
  } = useWriteContract();

  const {
    writeContract: distributeRewardsFn,
    isPending: isLoadingDistributeRewards,
    isSuccess: isSuccessDistributeRewards,
    isError: isErrorDistributeRewards,
  } = useWriteContract();

  useEffect(() => {
    if (isSuccessNewCycle) {
      toast.success("New epoch started successfully");
      refetchAdminData();
    }

    if (isErrorNewCycle) {
      toast.error("Error starting new epoch");
    }
  }, [isErrorNewCycle, isSuccessNewCycle, refetchAdminData]);

  useEffect(() => {
    if (isSuccessApproveWithdraw) {
      toast.success("Withdraw requests approved successfully");
      refetchAdminData();
    }

    if (isErrorApproveWithdraw) {
      toast.error("Error approving requests");
    }
  }, [isErrorApproveWithdraw, isSuccessApproveWithdraw, refetchAdminData]);

  useEffect(() => {
    if (isSuccessDistributeRewards) {
      toast.success("Rewards distributed successfully");
      refetchAdminData();
    }

    if (isErrorDistributeRewards) {
      toast.error("Error distributing rewards");
    }
  }, [isErrorDistributeRewards, isSuccessDistributeRewards, refetchAdminData]);

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

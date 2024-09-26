import { depositAbi, depositAddress } from "@/utils/depositContract";
import { handleError } from "@/utils/functions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";

const useRewards = () => {
  const {
    writeContract: claimRewardsFn,
    isPending: isLoadingClaimRewards,
    isSuccess: isSuccessClaimRewards,
    isError: isErrorClaimRewards,
    error: claimRewardsError,
  } = useWriteContract();

  const {
    writeContract: reDepositFn,
    isPending: isLoadingReDeposit,
    isSuccess: isSuccessReDeposit,
    isError: isErrorRedeposit,
    error: redepositError,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorRedeposit) {
      handleError(redepositError.message);
    }
  }, [isErrorRedeposit, redepositError]);

  useEffect(() => {
    if (isErrorClaimRewards) {
      handleError(claimRewardsError.message);
    }
  }, [isErrorClaimRewards, claimRewardsError]);

  const claimRewards = () => {
    claimRewardsFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "claimRewards",
    });
  };

  const reDeposit = () => {
    reDepositFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "reDeposit",
    });
  };

  return {
    claimRewards,
    isLoadingClaimRewards,
    isSuccessClaimRewards,
    reDeposit,
    isLoadingReDeposit,
    isSuccessReDeposit,
  };
};

export default useRewards;

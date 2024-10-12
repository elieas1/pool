import { depositAbi, depositAddress } from "@/utils/depositContract";
import { handleError } from "@/utils/functions";
import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const useRewards = () => {
  const {
    writeContract: claimRewardsFn,
    isPending: isLoadingClaimRewardsHash,
    isError: isErrorClaimRewards,
    error: claimRewardsError,
    data: claimRewardsHashData,
  } = useWriteContract();

  const { isLoading: isLoadingClaimRewards, isSuccess: isSuccessClaimRewards } =
    useWaitForTransactionReceipt({
      hash: claimRewardsHashData,
    });

  const {
    writeContract: reDepositFn,
    isPending: isLoadingRedepositHash,
    isError: isErrorRedeposit,
    error: redepositError,
    data: redepositHashData,
  } = useWriteContract();

  const { isLoading: isLoadingRedeposit, isSuccess: isSuccessRedeposit } =
    useWaitForTransactionReceipt({
      hash: redepositHashData,
    });

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
    isLoadingClaimRewardsHash,
    isLoadingClaimRewards,
    isSuccessClaimRewards,
    reDeposit,
    isLoadingRedeposit,
    isLoadingRedepositHash,
    isSuccessRedeposit,
  };
};

export default useRewards;

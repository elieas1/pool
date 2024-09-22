import { depositAbi, depositAddress } from "@/utils/depositContract";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";

const useRewards = () => {
  const {
    writeContract: claimRewardsFn,
    isPending: isLoadingClaimRewards,
    isSuccess: isSuccessClaimRewards,
    isError: isErrorClaimRewards,
  } = useWriteContract();

  const {
    writeContract: reDepositFn,
    isPending: isLoadingReDeposit,
    isSuccess: isSuccessReDeposit,
    isError: isErrorRedeposit,
    error,
  } = useWriteContract();

  console.log(error);

  useEffect(() => {
    if (isErrorClaimRewards) {
      toast.error("Claim failed");
    }

    if (isErrorRedeposit) {
      toast.error("Deposit failed");
    }
  }, [isErrorClaimRewards, isErrorRedeposit]);

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

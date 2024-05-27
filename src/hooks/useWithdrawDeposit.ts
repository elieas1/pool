import { depositAbi, depositAddress } from "@/utils/depositContract";
import { parseUsdc } from "@/utils/functions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";

const useWithdrawDeposit = () => {
  const {
    writeContract: requestWithdrawFn,
    isPending: isLoadingWithdrawRequest,
    isError: isErrorWithdrawRequest,
    isSuccess: isSuccessWithdrawRequest,
  } = useWriteContract();

  const {
    writeContract: cancelWithdrawFn,
    isPending: isLoadingCancelWithdraw,
    isError: isErrorCancelWithdraw,
    isSuccess: isSuccessCancelWithdraw,
  } = useWriteContract();

  const {
    writeContract: withdrawFn,
    isPending: isLoadingWithdraw,
    isError: isErrorWithdraw,
    isSuccess: isSuccessWithdraw,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorWithdrawRequest) {
      toast.error("Request failed");
    }

    if (isErrorCancelWithdraw) {
      toast.error("Cancel request failed");
    }

    if (isErrorWithdraw) {
      toast.error("Withdraw failed");
    }
  }, [isErrorCancelWithdraw, isErrorWithdraw, isErrorWithdrawRequest]);

  const requestWithdraw = () => {
    requestWithdrawFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "requestWithdraw",
    });
  };

  const cancelWithdraw = () => {
    cancelWithdrawFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "cancelRequestWithdraw",
    });
  };

  const withdraw = (amount: number) => {
    withdrawFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "withdraw",
      args: [parseUsdc(amount)],
    });
  };

  return {
    requestWithdraw,
    isLoadingWithdrawRequest,
    isSuccessWithdrawRequest,
    cancelWithdraw,
    isLoadingCancelWithdraw,
    isSuccessCancelWithdraw,
    withdraw,
    isLoadingWithdraw,
    isSuccessWithdraw,
  };
};

export default useWithdrawDeposit;

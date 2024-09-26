import { depositAbi, depositAddress } from "@/utils/depositContract";
import { handleError, parseUsdc } from "@/utils/functions";
import { useEffect } from "react";
import { useWriteContract } from "wagmi";

const useWithdrawDeposit = () => {
  const {
    writeContract: requestWithdrawFn,
    isPending: isLoadingWithdrawRequest,
    isError: isErrorWithdrawRequest,
    isSuccess: isSuccessWithdrawRequest,
    error: withdrawRequestError,
  } = useWriteContract();

  const {
    writeContract: cancelWithdrawFn,
    isPending: isLoadingCancelWithdraw,
    isError: isErrorCancelWithdraw,
    isSuccess: isSuccessCancelWithdraw,
    error: cancelWithdrawError,
  } = useWriteContract();

  const {
    writeContract: withdrawFn,
    isPending: isLoadingWithdraw,
    isError: isErrorWithdraw,
    isSuccess: isSuccessWithdraw,
    error: withdrawError,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorWithdraw) {
      handleError(withdrawError?.message);
    }
  }, [isErrorWithdraw, withdrawError]);

  useEffect(() => {
    if (isErrorCancelWithdraw) {
      handleError(cancelWithdrawError?.message);
    }
  }, [cancelWithdrawError, isErrorCancelWithdraw]);

  useEffect(() => {
    if (isErrorWithdrawRequest) {
      handleError(withdrawRequestError?.message);
    }
  }, [isErrorWithdrawRequest, withdrawRequestError]);

  const requestWithdraw = (amount: number) => {
    requestWithdrawFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "requestWithdraw",
      args: [parseUsdc(amount)],
    });
  };

  const cancelWithdraw = () => {
    cancelWithdrawFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "cancelRequestWithdraw",
    });
  };

  const withdraw = () => {
    withdrawFn({
      abi: depositAbi,
      address: depositAddress,
      functionName: "withdraw",
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

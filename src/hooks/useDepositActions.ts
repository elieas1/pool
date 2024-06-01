import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc } from "@/utils/functions";
import { usdcAbi, usdcAddress } from "@/utils/usdcContract";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useReadContract, useWriteContract } from "wagmi";

const useDepositActions = () => {
  const { data } = useReadContract({
    abi: usdcAbi,
    address: usdcAddress,
    functionName: "allowance",
    args: [usdcAddress, depositAddress],
  });

  const allowance = formatUsdc(Number(data));

  const {
    writeContract: approveUsdc,
    isSuccess: isSuccessApprove,
    isPending: isLoadingApprove,
    isError: isErrorApprove,
  } = useWriteContract();

  const {
    writeContract,
    isSuccess: isSuccessDeposit,
    isPending: isLoadingDeposit,
    isError: isErrorDeposit,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorDeposit) {
      toast.error("Deposit Failed");
    }

    if (isErrorApprove) {
      toast.error("Deposit failed");
    }
  }, [isErrorApprove, isErrorDeposit]);

  const approveAmount = (amount: number) => {
    approveUsdc({
      abi: usdcAbi,
      address: usdcAddress,
      functionName: "approve",
      args: [depositAddress, amount],
    });
  };

  const deposit = (amount: number) => {
    if (allowance < amount) {
      approveAmount(amount);
    } else {
      writeContract({
        abi: depositAbi,
        address: depositAddress,
        functionName: "deposit",
        args: [amount],
      });
    }
  };

  return {
    deposit,
    isSuccessDeposit,
    isLoadingDeposit,
    isLoadingApprove,
    isSuccessApprove,
    approveAmount,
  };
};

export default useDepositActions;

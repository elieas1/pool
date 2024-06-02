import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc, parseUsdc } from "@/utils/functions";
import { usdcAbi, usdcAddress } from "@/utils/usdcContract";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useReadContract, useWriteContract } from "wagmi";

const useDepositActions = ({
  address,
}: {
  address: `0x${string}` | undefined;
}) => {
  const { data, refetch: refetchAllowance } = useReadContract({
    abi: usdcAbi,
    address: usdcAddress,
    functionName: "allowance",
    args: [address, depositAddress],
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

  useEffect(() => {
    if (isSuccessApprove) {
      refetchAllowance();
    }
  }, [isSuccessApprove, refetchAllowance]);

  const depositAmount = useCallback(
    (amount: number) => {
      writeContract({
        abi: depositAbi,
        address: depositAddress,
        functionName: "deposit",
        args: [parseUsdc(amount)],
      });
    },
    [writeContract]
  );

  const deposit = (amount: number) => {
    if (allowance < amount) {
      approveUsdc({
        abi: usdcAbi,
        address: usdcAddress,
        functionName: "approve",
        args: [depositAddress, parseUsdc(amount)],
      });
    } else {
      depositAmount(amount);
    }
  };

  return {
    deposit,
    isSuccessDeposit,
    isLoadingDeposit,
    isLoadingApprove,
    isSuccessApprove,
    depositAmount,
  };
};

export default useDepositActions;

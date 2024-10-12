import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc, handleError, parseUsdc } from "@/utils/functions";
import { usdcAbi, usdcAddress } from "@/utils/usdcContract";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

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
    isPending: isLoadingApproveHash,
    isError: isErrorApprove,
    data: approveHash,
  } = useWriteContract();

  const { isLoading: isLoadingApprove } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const {
    writeContract,
    isPending: isLoadingDepositHash,
    isError: isErrorDeposit,
    error: depositError,
    data: depositHashData,
  } = useWriteContract();

  const { isLoading: isLoadingDeposit, isSuccess: isSuccessDeposit } =
    useWaitForTransactionReceipt({
      hash: depositHashData,
    });

  useEffect(() => {
    if (isErrorDeposit) {
      handleError(depositError.message);
    }
  }, [depositError, isErrorDeposit]);

  useEffect(() => {
    if (isErrorApprove) {
      toast.error("Approve failed");
    }
  }, [isErrorApprove]);

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
    isLoadingApproveHash,
    isSuccessApprove,
    isLoadingDepositHash,
    depositAmount,
  };
};

export default useDepositActions;

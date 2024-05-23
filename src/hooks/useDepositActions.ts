import { depositAbi, depositAddress } from "@/utils/depositContract";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWriteContract } from "wagmi";

const useDepositActions = () => {
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
  }, [isErrorDeposit]);

  const deposit = (amount: number) => {
    writeContract({
      abi: depositAbi,
      address: depositAddress,
      functionName: "deposit",
      args: [amount],
    });
  };

  return {
    deposit,
    isSuccessDeposit,
    isLoadingDeposit,
  };
};

export default useDepositActions;

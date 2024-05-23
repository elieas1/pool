import { depositAbi, depositAddress } from "@/utils/depositContract";
import { parseUsdc } from "@/utils/functions";
import { useReadContract } from "wagmi";

type Props = {
  searchValue: `0x${string}` | string;
};

type returnedValue = {
  data:
    | {
        amount: bigint;
        claimableRewards: bigint;
        claimedRewards: bigint;
        withdrawApproved: bigint;
        withdrawableAmount: bigint;
        initialDepositTime: bigint;
        reDepositTime: bigint;
        pendingAmount: bigint;
      }
    | undefined;
  refetch: () => void;
  isLoading: boolean;
  isRefetching: boolean;
  isSuccess: boolean;
};

const useGetUserDeposit = ({ searchValue }: Props) => {
  const {
    data: userInfo,
    refetch,
    isRefetching,
    isLoading: isLoadingUserDeposit,
    isSuccess: isSuccessUserDeposit,
  }: returnedValue = useReadContract({
    abi: depositAbi,
    address: depositAddress,
    functionName: "getUserDeposit",
    args: [searchValue],
    query: {
      enabled: false,
    },
  });

  const {
    amount,
    claimableRewards,
    claimedRewards,
    initialDepositTime,
    pendingAmount,
    reDepositTime,
    withdrawApproved,
    withdrawableAmount,
  } = userInfo ?? {};

  return {
    amount: parseUsdc(Number(amount)),
    claimableRewards: parseUsdc(Number(claimableRewards)),
    claimedRewards: parseUsdc(Number(claimedRewards)),
    initialDepositTime,
    pendingAmount: parseUsdc(Number(pendingAmount)),
    reDepositTime,
    withdrawApproved,
    withdrawableAmount: parseUsdc(Number(withdrawableAmount)),
    refetch,
    isRefetching,
    isLoadingUserDeposit,
    isSuccessUserDeposit,
  };
};

export default useGetUserDeposit;

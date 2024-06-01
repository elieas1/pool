import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc } from "@/utils/functions";
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
    amount: formatUsdc(Number(amount)),
    claimableRewards: formatUsdc(Number(claimableRewards)),
    claimedRewards: formatUsdc(Number(claimedRewards)),
    initialDepositTime,
    pendingAmount: formatUsdc(Number(pendingAmount)),
    reDepositTime,
    withdrawApproved,
    withdrawableAmount: formatUsdc(Number(withdrawableAmount)),
    refetch,
    isRefetching,
    isLoadingUserDeposit,
    isSuccessUserDeposit,
  };
};

export default useGetUserDeposit;

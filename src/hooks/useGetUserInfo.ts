import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc, parseUsdc } from "@/utils/functions";
import { useAccount, useReadContract } from "wagmi";

type response = {
  data:
    | {
        pendingAmount: bigint;
        amount: bigint;
        withdrawableAmount: bigint;
        claimableRewards: bigint;
        claimedRewards: bigint;
        withdrawApproved: boolean;
        withrawalRequestAmount: bigint;
      }
    | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
};

const useGetUserInfo = () => {
  const { address } = useAccount();

  const {
    data: userData,
    isLoading: isLoadingUserData,
    isError: isErrorUserData,
    refetch: refetchUserData,
    isSuccess: isSuccesUserData,
  }: response = useReadContract({
    abi: depositAbi,
    address: depositAddress,
    functionName: "getUserDeposit",
    args: [address],
  });

  const pendingAmount = formatUsdc(Number(userData?.pendingAmount) || 0);
  const depositedAmount = formatUsdc(Number(userData?.amount) || 0);
  const withdrawableAmount = formatUsdc(
    Number(userData?.withdrawableAmount) || 0
  );
  const claimableRewards = formatUsdc(Number(userData?.claimableRewards) || 0);
  const claimedRewards = formatUsdc(Number(userData?.claimedRewards) || 0);
  const withdrawApproved = userData?.withdrawApproved || false;
  const withrawalRequestAmount =
    formatUsdc(Number(userData?.withrawalRequestAmount)) || 0;

  return {
    pendingAmount,
    depositedAmount,
    withdrawableAmount,
    withdrawApproved,
    claimedRewards,
    claimableRewards,
    isLoadingUserData,
    isErrorUserData,
    refetchUserData,
    isSuccesUserData,
    withrawalRequestAmount,
  };
};

export default useGetUserInfo;

import { depositAbi, depositAddress } from "@/utils/depositContract";
import { parseUsdc } from "@/utils/functions";
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

  const pendingAmount = parseUsdc(Number(userData?.pendingAmount) || 0);
  const depositedAmount = parseUsdc(Number(userData?.amount) || 0);
  const withdrawableAmount = parseUsdc(
    Number(userData?.withdrawableAmount) || 0
  );
  const claimableRewards = parseUsdc(Number(userData?.claimableRewards) || 0);
  const claimedRewards = parseUsdc(Number(userData?.claimedRewards) || 0);
  const withdrawApproved = userData?.withdrawApproved || false;

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
  };
};

export default useGetUserInfo;

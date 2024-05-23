import { depositAbi, depositAddress } from "@/utils/depositContract";
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

  const pendingAmount = Number(userData?.pendingAmount) || 0;
  const depositedAmount = Number(userData?.amount) || 0;
  const withdrawableAmount = Number(userData?.withdrawableAmount) || 0;
  const claimableRewards = Number(userData?.claimableRewards) || 0;
  const claimedRewards = Number(userData?.claimedRewards) || 0;
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

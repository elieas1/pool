import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc } from "@/utils/functions";
import { useReadContracts } from "wagmi";

const useGetAdminData = () => {
  const {
    data,
    refetch: refetchAdminData,
    isSuccess: isSuccessAdminData,
    isError: isErrorAdminData,
  }: {
    data:
      | [
          { result: number },
          { result: `0x${string}`[] },
          { result: `0x${string}` },
          { result: number },
          { result: `0x${string}`[] },
          { result: `0x${string}`[] },
          { result: number }
        ]
      | undefined;
    refetch: () => void;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  } = useReadContracts({
    contracts: [
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "totalDeposited",
      },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "getWithdrawRequests",
      },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "owner",
      },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "getWithdrawRequestsAmount",
      },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "getSuccessfullyDeposited",
      },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "getAwaitingApproval",
      },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "totalPending",
      },
    ],
  });

  const { result: totalDepositedBigInt } = data?.[0] ?? {};
  const { result: withdrawRequests } = data?.[1] ?? {};
  const { result: ownerAddress } = data?.[2] ?? {};
  const { result: withdrawAmount } = data?.[3] ?? {};
  const { result: successfullyDeposited } = data?.[4] ?? {};
  const { result: awaitingApproval } = data?.[5] ?? {};
  const { result: totalPendingBigInt } = data?.[6] ?? {};

  const totalDeposited = formatUsdc(Number(totalDepositedBigInt));
  const totalWithdrawAmount = formatUsdc(Number(withdrawAmount));
  const totalPending = formatUsdc(Number(totalPendingBigInt));

  return {
    totalDeposited,
    withdrawRequests,
    ownerAddress,
    totalWithdrawAmount,
    successfullyDeposited,
    awaitingApproval,
    refetchAdminData,
    isSuccessAdminData,
    isErrorAdminData,
    totalPending,
  };
};

export default useGetAdminData;

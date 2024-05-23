import { depositAbi, depositAddress } from "@/utils/depositContract";
import { parseUsdc } from "@/utils/functions";
import { useReadContracts } from "wagmi";

const useGetAdminData = () => {
  const {
    data,
    refetch: refetchAdminData,
    isLoading,
    isError,
  }: {
    data:
      | [
          { result: number },
          { result: `0x${string}`[] },
          { result: `0x${string}` },
          { result: number },
          { result: `0x${string}`[] },
          { result: `0x${string}`[] }
        ]
      | undefined;
    refetch: () => void;
    isLoading: boolean;
    isError: boolean;
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
    ],
  });

  const { result: totalDepositedBigInt } = data?.[0] ?? {};
  const { result: withdrawRequests } = data?.[1] ?? {};
  const { result: ownerAddress } = data?.[2] ?? {};
  const { result: withdrawAmount } = data?.[3] ?? {};
  const { result: successfullyDeposited } = data?.[4] ?? {};
  const { result: awaitingApproval } = data?.[5] ?? {};

  const totalDeposited = parseUsdc(Number(totalDepositedBigInt));
  const totalWithdrawAmount = parseUsdc(Number(withdrawAmount));

  return {
    totalDeposited,
    withdrawRequests,
    ownerAddress,
    totalWithdrawAmount,
    successfullyDeposited,
    awaitingApproval,
    refetchAdminData,
  };
};

export default useGetAdminData;

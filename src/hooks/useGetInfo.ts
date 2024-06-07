import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc } from "@/utils/functions";
import { useReadContracts } from "wagmi";

const useGetInfo = () => {
  const {
    data,
    refetch: refetchInfo,
    isSuccess: isSuccessInfo,
    isLoading: isLoadingInfo,
  }: {
    data:
      | [
          { result: number },
          {
            result: {
              totalDeposit: number;
              reward: number;
              epochTime: number;
              adminBalance: number;
            }[];
          },
          { result: `0x${string}`[] },
          { result: number }
        ]
      | undefined;
    refetch: () => void;
    isSuccess: boolean;
    isLoading: boolean;
  } = useReadContracts({
    contracts: [
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "totalDeposited",
      },
      { abi: depositAbi, address: depositAddress, functionName: "getHistory" },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "getWithdrawRequests",
      },
      {
        abi: depositAbi,
        address: depositAddress,
        functionName: "lastEpochTime",
      },
    ],
  });

  const { result: totalDepositBigInt } = data?.[0] ?? {};
  const { result: rewardHistory } = data?.[1] ?? {};
  const { result: withdrawRequests } = data?.[2] ?? {};
  const { result: lastEpochTimeBigInt } = data?.[3] ?? {};
  const totalDeposited = formatUsdc(Number(totalDepositBigInt)) || 0;
  const lastEpochTime = Number(lastEpochTimeBigInt);

  return {
    totalDeposited,
    rewardHistory,
    withdrawRequests,
    refetchInfo,
    isSuccessInfo,
    isLoadingInfo,
    lastEpochTime,
  };
};

export default useGetInfo;

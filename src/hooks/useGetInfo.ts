import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc } from "@/utils/functions";
import { useReadContracts } from "wagmi";

const useGetInfo = () => {
  const {
    data,
    refetch: refetchInfo,
    isSuccess: isSuccessInfo,
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
          { result: `0x${string}`[] }
        ]
      | undefined;
    refetch: () => void;
    isSuccess: boolean;
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
    ],
  });

  const { result: totalDepositBigInt } = data?.[0] ?? {};
  const { result: rewardHistory } = data?.[1] ?? {};
  const { result: withdrawRequests } = data?.[2] ?? {};
  const totalDeposited = formatUsdc(Number(totalDepositBigInt)) || 0;

  return {
    totalDeposited,
    rewardHistory,
    withdrawRequests,
    refetchInfo,
    isSuccessInfo,
  };
};

export default useGetInfo;

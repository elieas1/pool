import { depositAddress } from "@/utils/depositContract";
import { usdcAbi, usdcAddress } from "@/utils/usdcContract";
import { useReadContracts } from "wagmi";

type Props = {
  address: `0x${string}` | undefined;
};

const useGetUsdcBalance = ({ address }: Props) => {
  const {
    data,
    refetch: refetchBalances,
    isSuccess: isSuccessLoadingBalance,
  } = useReadContracts({
    contracts: [
      {
        address: usdcAddress,
        abi: usdcAbi,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: usdcAddress,
        abi: usdcAbi,
        functionName: "balanceOf",
        args: [depositAddress],
      },
    ],
  });

  const { result: userBalance } = data?.[0] ?? {};
  const { result: contractBalance } = data?.[1] ?? {};

  return {
    userBalance: Number(userBalance),
    contractBalance: Number(contractBalance),
    refetchBalances,
    isSuccessLoadingBalance,
  };
};

export default useGetUsdcBalance;

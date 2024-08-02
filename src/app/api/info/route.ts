import { config } from "@/config";
import { depositAbi, depositAddress } from "@/utils/depositContract";
import { formatUsdc } from "@/utils/functions";
import { NextResponse } from "next/server";
import { readContract } from "wagmi/actions";

interface HistoryEntry {
  adminBalance: string;
  epochTime: string;
  totalDeposit: string;
  // Add other properties if there are more
}

export async function GET() {
  const data = await readContract(config, {
    abi: depositAbi,
    address: depositAddress,
    functionName: "totalDeposited",
  });

  const history = (await readContract(config, {
    abi: depositAbi,
    address: depositAddress,
    functionName: "getHistory",
  })) as HistoryEntry[];

  const lastEpoch = history?.[history?.length - 1];

  const { adminBalance, epochTime, totalDeposit } = lastEpoch ?? {};

  const formattedAdminBalance = Number(adminBalance!);
  const formattedTotalDeposit = formatUsdc(Number(totalDeposit!));

  const apr =
    history?.length! > 0
      ? ((formattedAdminBalance - formattedTotalDeposit) /
          formattedTotalDeposit) *
        (365 / (Number(epochTime!) / 86400)) *
        100
      : 0;

  return NextResponse.json({
    totalDeposit: formatUsdc(Number(data)).toFixed(0),
    apr: apr.toFixed(2),
  });
}

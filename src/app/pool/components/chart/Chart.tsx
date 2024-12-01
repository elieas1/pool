import { formatUsdc } from "@/utils/functions";
import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import Chart from "react-google-charts";

const LineChart = ({
  array,
}: {
  array:
    | {
        totalDeposit: number;
        reward: number;
        adminBalance: number;
        epochTime: number;
      }[]
    | undefined;
}) => {
  const options = {
    colors: ["white"],
    backgroundColor: "transparent",
    vAxis: {
      title: "APR (percent)",
      viewWindow: {
        min: 0,
        max: 100, // Adjust this to provide some padding above the highest point
      },
      titleTextStyle: {
        color: "#ffffff", // Change title text color to white
      },
      textStyle: {
        color: "#ffffff", // Change axis text color to white
      },
      gridlines: {
        count: 3, // Ensure there are enough gridlines for padding
      },
      ticks: [50, 100],
    },
    hAxis: {
      title: "Epoch",
      viewWindow: {
        min: 0,
        // fixing khabset roayre
        max: (array?.length ?? 0) - 6, // Adjust this to provide some padding above the highest point
      },
      gridlines: {
        count: array?.length, // Ensure there are enough gridlines for padding
      },
      titleTextStyle: {
        color: "#ffffff", // Change title text color to white
      },
      textStyle: {
        color: "#ffffff", // Change axis text color to white
      },
    },
    chartArea: {
      left: 40, // Adjust this to add padding on the left
      top: 30, // Adjust this to add padding on the top
      right: 30, // Adjust this to add padding on the right
      bottom: 40, // Adjust this to add padding on the bottom
      width: "100%", // Adjust this to control the chart area width
      height: "100%", // Adjust this to control the chart area height
    },
    pointSize: 5, // Size of the points
    pointsVisible: true,
    legend: "none",
  };

  const data: (string | number)[][] = [["Epoch", "APR"]];

  array?.map((item, index) => {
    const { totalDeposit, adminBalance, epochTime } = item ?? {};

    const formattedTotalDeposit = formatUsdc(Number(totalDeposit));
    const formattedAdminBalance = Number(adminBalance);
    const formattedEpochTime = Number(epochTime) / 86400;

    const apr =
      ((formattedAdminBalance - formattedTotalDeposit) /
        formattedTotalDeposit) *
      (365 / formattedEpochTime) *
      100;

    if (index > 11 && index < 19) {
      return;
    }

    data.push([index + 1, apr]);
  });

  if (!array || array?.length === 0) {
    data.push([0, 0]);
  }

  return (
    <Card
      style={{ backgroundColor: "#2E334B" }}
      className="min-h-[300px]"
      isBlurred
    >
      <CardBody>
        <Chart
          chartType="LineChart"
          width="100%"
          height="100%"
          data={data}
          options={options}
        />
      </CardBody>
    </Card>
  );
};

export default LineChart;

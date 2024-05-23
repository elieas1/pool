import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import Chart from "react-google-charts";

export const options = {
  colors: ["blue"],
  backgroundColor: "transparent",
  vAxis: {
    title: "APR (percent)",
    viewWindow: {
      min: 0,
      max: 25, // Adjust this to provide some padding above the highest point
    },
    gridlines: {
      count: 3, // Ensure there are enough gridlines for padding
    },
  },
  hAxis: {
    title: "Epoch",
    viewWindow: {
      min: 0,
      max: 4, // Adjust this to provide some padding above the highest point
    },
    gridlines: {
      count: 4, // Ensure there are enough gridlines for padding
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

const LineChart = ({
  array,
}: {
  array: { totalDeposit: number; reward: number }[] | undefined;
}) => {
  const data: (string | number)[][] = [["Epoch", "APR"]];

  array?.map((item, index) => {
    const { totalDeposit, reward } = item ?? {};
    data.push([index, Number(reward)]);
  });

  if (!array || array?.length === 0) {
    data.push([0, 0]);
  }

  return (
    <Card className="min-h-[300px]" isBlurred>
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

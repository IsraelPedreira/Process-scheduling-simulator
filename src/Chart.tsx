import React from "react";
import { Chart } from "react-google-charts";

export const ChartComponent = ({ data, options }) => {
  return (
    <Chart
      chartType="Timeline"
      data={data}
      width="100%"
      height="400px"
      options={options}
    />
  );
};

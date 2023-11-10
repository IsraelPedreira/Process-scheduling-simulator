import React from "react";
import { Chart } from "react-google-charts";
import MemTable from "./MemTable"
import "./gantt.css"

export const ChartComponent = ({ data, options, turnaround }) => {
  return (
    <>
      <p className="turnaround-text">Turnaround: {turnaround}</p>

      <Chart
        chartType="Timeline"
        data={data}
        width="100%"
        height="400px"
        options={options}
      />

      <MemTable />
    </>
  );
};

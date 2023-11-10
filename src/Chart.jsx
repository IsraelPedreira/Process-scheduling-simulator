import React from "react";
import { Chart } from "react-google-charts";
import MemTable from "./MemTable"
import "../styles/gantt.css"

export const ChartComponent = ({ data, pageTable, options, turnaround, pageFaults }) => {
  return (
    <>
      <p className="turnaround-text">Turnaround: {turnaround}</p>
			<p className="page-faults-text">Total de page faults: {pageFaults}</p>

      <Chart
        chartType="Timeline"
        data={data}
        width="100%"
        height="400px"
        options={options}
      />
			<MemTable pageTable={pageTable}/>
    </>
  );
};

import React from "react";
import { Chart } from "react-google-charts";
import MemTable from "./MemTable"
import "../styles/gantt.css"

export const ChartComponent = ({ data, pageTable, options, turnaround, pageFaults }) => {
  return (
    <>
      <div className="calc-div">
        <p className="turnaround-text">Turnaround: {turnaround}</p>
			  <p className="page-faults-text">Total de page faults: {pageFaults}</p>
      </div>
      <Chart
        chartType="Timeline"
        data={data}
        width="100%"
        height="600px"
        options={options}
      />
			<div className="status-div">
				<p className="status-text">Status: executando...</p>
			</div>
			<MemTable pageTable={pageTable}/>
    </>
  );
};

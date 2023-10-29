import React from "react";
import { Chart } from "react-google-charts";


export const data = [
  [
    { type: "string", id: "President" },
    { type: "string", id: "dummy bar label" },
    { type: "string", role: "tooltip" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ],
  ["1", null, "George", new Date(1), new Date(3)],
  ["2", null, "John",new Date(4),new Date(5)],
  ["3", null, "John", new Date(6),new Date(10)],
];

export const options = {
  allowHtml: true,
  timeline: {
    rowLabelStyle: {
      fontName: "Helvetica",
      fontSize: 24,
      color: "#603913",
    },
    barLabelStyle: { fontName: "Garamond", fontSize: 14 },
  },
};



export default function App() {

  return (
    <Chart
      chartType="Timeline"
      data={data}
      width="100%"
      height="400px"
      options={options}
    />
  );
}

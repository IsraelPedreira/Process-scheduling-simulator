import React from "react";
import { render } from "react-dom";

import { ChartFactory } from "./ChartFactory";

const rootElement = document.getElementById("gantt-root");

const stringfied_process_table = sessionStorage.getItem("process_table")
if (!stringfied_process_table){
    alert("Error: no process data provided")
} else {
    render(<ChartFactory data_from_menu={JSON.parse(stringfied_process_table)}/>, rootElement);
}

import React from "react";
import { render } from "react-dom";

import { ChartFactory } from "./ChartFactory";

const rootElement = document.getElementById("gantt-root");

const process_table = JSON.parse(sessionStorage.getItem("process_table"))

render(<ChartFactory data_from_menu={process_table}/>, rootElement);

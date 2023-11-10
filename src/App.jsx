import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client'
import { ChartFactory } from "./ChartFactory";
import { MemTable } from "./MemTable";

document.addEventListener("DOMContentLoaded", function () {
  const rootElement = document.getElementById("gantt-root");
  const queryParams = new URLSearchParams(window.location.search);
  const dataQueryParam = queryParams.get("data");
  const mode = queryParams.get("mode");
	const quantum = parseInt(Number(queryParams.get("quantum")));
	const switchCost = parseInt(Number(queryParams.get("switchCost")));
  const data = dataQueryParam ? JSON.parse(decodeURIComponent(dataQueryParam)) : null;

  ReactDOM.createRoot(document.getElementById("gantt-root")).render(
		<>
			<ChartFactory data_from_menu={data} mode={mode} quantum={quantum} switchCost={switchCost} />
			<MemTable />
		</>
	);
});

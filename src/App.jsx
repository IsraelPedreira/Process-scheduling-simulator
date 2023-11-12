import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client'
import { ChartFactory } from "./ChartFactory";
import { MemTable } from "./MemTable";

document.addEventListener("DOMContentLoaded", function () {
  const rootElement = document.getElementById("gantt-root");
  const queryParams = new URLSearchParams(window.location.search);
  const dataQueryParam = queryParams.get("data");
  const schedMode = queryParams.get("schedMode");
  const memMode = queryParams.get("memMode");
	const quantum = parseInt(Number(queryParams.get("quantum")));
	const switchCost = parseInt(Number(queryParams.get("switchCost")));
  const data = dataQueryParam ? JSON.parse(decodeURIComponent(dataQueryParam)) : null;

	// TODO make memMode customizable
  ReactDOM.createRoot(document.getElementById("gantt-root")).render(
		<>
			<ChartFactory data_from_menu={data} schedMode={schedMode} memMode={memMode} quantum={quantum} switchCost={switchCost} />
		</>
	);
});

import React, { useEffect, useState } from "react";
import { ChartComponent } from "./Chart";
// import FIFO from "./sched/FIFO";
// import SJF from "./sched/SJF";
// import RR from "./sched/RR";
// import EDF from "./sched/EDF";
import { FIFO, SJF, EDF, RoundRobin as RR } from "./sched/process";
import { FIFO as FIFO_MEM } from "./pagination/FIFO";
import Convert from "./utils";
// import { render } from "react-dom";
import ReactDOM from 'react-dom/client'

export const MEMORY_SIZE = 50; // see specification

export function ChartFactory({ data_from_menu, schedMode, memMode, quantum, switchCost }) {
  // UseState pra o array de guarda as infos do chart
  const [to_chart_data, setToChartData] = useState([]);
  const [totalTurnaround, setTotalTurnaround] = useState(0);
	const [pageTable, setPageTable] = useState(Array(MEMORY_SIZE).fill("x"));

  // Options requeridas pelo Google Chart
  let options = {
    allowHtml: true,
    enableInteractivity: false,
    hAxis: {
      minValue: 0,
      maxValue: 60,
    },
    timeline: {
      colorByRowLabel: true,
    },
  }

  // Funcao que anima o chart
  async function chart_animation(chartData, pageTableHistory) {
      chartData.map((processo, index) => {
        if(index > 0){  
          processo[1] = `${processo[3]} - ${processo[4]}`
        } 
      })
      chartData.splice(1,1);
      
    const delay = 1; // delay de atualizacao da animacao
    const animationStep = 0.03; // de quanto em quanto a barra vai crescer
  
    for (let i = 0; i < chartData.length; i++) {
			// update page table
			const [_, pageTableCurrent] = pageTableHistory[i];
			setPageTable(pageTableCurrent);
			// request animation of process i
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Use requestAnimationFrame for smoother animations

      let currentData = chartData.slice(0, i + 1);
      let currentProcess = currentData[i];
      let currentProcessStart = currentProcess[3];
      let currentProcessEnd = currentProcess[4];

      for (
        let j = currentProcessStart;
        j < currentProcessEnd;
        j += animationStep
      ) {
        currentData[i][4] = j;
        setToChartData([...currentData]);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

	// runs only once
  const useEffectFactory = (schedMode, memMode) => {
    return useEffect(() => {
			let schedData = null;
			if (schedMode == "FIFO") {
				schedData = FIFO(data_from_menu);
			} else if (schedMode == "SJF") {
				schedData = SJF(data_from_menu);
			} else if (schedMode == "EDF") {
				schedData = EDF(data_from_menu, quantum, switchCost);
			} else if (schedMode == "RR") {
				schedData = RR(data_from_menu, quantum, switchCost);
			}
			let tempPageTable = Array(MEMORY_SIZE).fill("x");
			let pageTableHistory = [];
			if (memMode == "FIFO") {
				pageTableHistory = FIFO_MEM(tempPageTable, (newPageTable) => newPageTable, schedData);
			} else if (memMode == "LRU") {
				// TODO implement LRU
			}
			// HACK : so that it aligns with the chart, since it needs an extra entry for labels
			pageTableHistory.unshift([false, Array(MEMORY_SIZE).fill("x")])

      let turnarounds = new Map();
			// init keys
			data_from_menu.forEach((process) => {
				turnarounds.set(process.pid, {
					"min_time": process.arrival_time,
					"max_time": process.arrival_time
				});
			})
			// calculate max end time for each process
			schedData.forEach((process) => {
				if (process.pid != "Chaveamento"){
					const min_time = turnarounds.get(process.pid).min_time;
					turnarounds.set(
						process.pid,
						{
							"min_time": min_time,
							"max_time": process.end_time
						}
					);
				}
			})
      let final_turnaround = 0.0
      for (const [_, process_info] of turnarounds){
        final_turnaround += (process_info.max_time - process_info.min_time) / data_from_menu.length
      }
      setTotalTurnaround(final_turnaround.toFixed(2));
      
      let chartData = Convert(schedData);
      chart_animation(chartData, pageTableHistory);
    }, []);
  }

	useEffectFactory(schedMode, memMode)

  return <ChartComponent data={to_chart_data} pageTable={pageTable} options={options} turnaround={totalTurnaround} />;
}

export default ChartFactory;

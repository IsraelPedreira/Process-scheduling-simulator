import React, { useEffect, useState } from "react";
import { ChartComponent } from "./Chart";
import { FIFO, SJF, EDF, RoundRobin as RR } from "./sched/process";
import { FIFO as FIFO_MEM } from "./pagination/FIFO";
import { LRU as LRU_MEM } from "./pagination/LRU";
import { calculateTurnaround } from "./sched/turnaround";
import Convert from "./utils";

export const MEMORY_SIZE = 50; // see specification

export function ChartFactory({ data_from_menu, schedMode, memMode, quantum, switchCost }) {
  // UseState pra o array de guarda as infos do chart
  const [to_chart_data, setToChartData] = useState([]);
  const [totalTurnaround, setTotalTurnaround] = useState(0);
	const [totalPageFaults, setTotalPageFaults] = useState(0);
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
      
    const delay = 1; // delay de atualizacao da animacao // FIXME change back to 1
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
		// end of animation
		document.getElementsByClassName("status-text")[0].innerHTML = "Status: finalizado";
  }

	// runs only once
  const useEffectFactory = (schedMode, memMode) => {
    return useEffect(() => {
			let schedData = null;
			switch (schedMode) {
        case "FIFO":
				  schedData = FIFO(data_from_menu);
          break;
			  case "SJF":
				  schedData = SJF(data_from_menu);
          break;
			  case "EDF":
				  schedData = EDF(data_from_menu, quantum, switchCost);
          break;
			  case "RR":
				  schedData = RR(data_from_menu, quantum, switchCost);
          break;
        default:
          throw Error("Unreachable");
			}
			let tempPageTable = Array(MEMORY_SIZE).fill({"page": "x", "pid": "x"});
			let pageTableHistory = [];
			switch (memMode) {
				case "FIFO":
				  pageTableHistory = FIFO_MEM(tempPageTable, schedData);
					break;
			  case "LRU":
					pageTableHistory = LRU_MEM(tempPageTable, schedData);
					break;
				default:
					throw Error("Unreachable");
			}

			// calculate average turnaround
			const final_turnaround = calculateTurnaround(data_from_menu, schedData);
      setTotalTurnaround(final_turnaround.toFixed(2));

			// calculate total page faults
			const final_page_faults = pageTableHistory.filter(([status, _]) => status).length;
			setTotalPageFaults(final_page_faults);
      
      let chartData = Convert(schedData);
      chart_animation(chartData, pageTableHistory);
    }, []);
  }

	useEffectFactory(schedMode, memMode)

  return <ChartComponent data={to_chart_data} pageTable={pageTable} options={options} turnaround={totalTurnaround} pageFaults={totalPageFaults}/>;
}

export default ChartFactory;

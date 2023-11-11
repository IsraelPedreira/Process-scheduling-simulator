import React, { useEffect, useState } from "react";
import { ChartComponent } from "./Chart";
import { FIFO, SJF, EDF, RoundRobin as RR } from "./sched/process";
import { FIFO as FIFO_MEM } from "./pagination/FIFO";
import { calculateTurnaround } from "./sched/turnaround";
import Convert from "./utils";

export const MEMORY_SIZE = 50; // see specification

export function ChartFactory({ data_from_menu, schedMode, memMode, quantum, switchCost }) {
  // UseState pra o array de guarda as infos do chart
  const [to_chart_data, setToChartData] = useState([]);
  const [totalTurnaround, setTotalTurnaround] = useState(0);
	const [totalPageFaults, setTotalPageFaults] = useState(0);
	const [pageTable, setPageTable] = useState(Array(MEMORY_SIZE).fill("x"));
  const [chartColors, setChartColors] = useState([]);
  const [setupProcesses, setSetupProcesses] = useState([]);

  // Options requeridas pelo Google Chart
  let options = {
    allowHtml: true,
    enableInteractivity: false,
    colors: chartColors,
    timeline: {
      showRowLabel: false
    }
  }

  function set_chart_colors(chartData) {
    // Atualiza o array de cores antes de iniciar a animacao
    const newColors = [];
    let colored = [];
    for (let i = 1; i < chartData.length; i++) {
      if (!colored.includes(chartData[i][1])) {
        if (chartData[i][1] === "Chaveamento") {
          newColors.push("#B22222");
        } else if (chartData[i][1] === "process_position_marker") {
          newColors.push("#FFFFFF");
        } else {
          newColors.push("#008000");
        }
        colored.push(chartData[i][1]);
      }
    }
    setChartColors(newColors);
  }


  // Funcao que anima o chart
  async function chart_animation(chartData, pageTableHistory) {
    set_chart_colors(chartData);
     
    const delay = 1; // delay de atualizacao da animacao
    const animationStep = 20; // de quanto em quanto a barra vai crescer
    for (let i = 1; i < chartData.length; i++) {
			// update page table
			const [_, pageTableCurrent] = pageTableHistory[i];
			setPageTable(pageTableCurrent);
			// request animation of process i
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Use requestAnimationFrame for smoother animations

      let currentData = chartData.slice(0, i + 1);
      let currentProcess = currentData[i];
      let currentProcessStart = currentProcess[2].getTime();
      let currentProcessEnd = currentProcess[3].getTime();

      for (
        let j = currentProcessStart;
        j <= currentProcessEnd;
        j += animationStep
      ) {
        currentData[i][3] = new Date(j);
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
			// NOTE : so that it aligns with the chart, since it needs an extra entry for labels
			pageTableHistory.unshift([false, Array(MEMORY_SIZE).fill("x")])

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

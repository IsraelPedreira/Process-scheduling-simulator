import { useEffect, useState } from "react";
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
  const [chartColors, setChartColors] = useState([]);

  // Options requeridas pelo Google Chart
  let options = {
    allowHtml: true,
    enableInteractivity: false,
    colors: chartColors,
    timeline: {
      showRowLabel: false,
      showBarLabels: false
    }
  }

  function set_chart_colors(chartData) {
    // Atualiza o array de cores antes de iniciar a animacao
    const newColors = [];
    let colored = [];
    for (let i = 1; i < chartData.length; i++) {
      if (!colored.includes(chartData[i][1])) {
        if (chartData[i][1] === "Chaveamento" || chartData[i][1] === "ChaveamentoComplemento") {
          newColors.push("#B22222");
        } else if (chartData[i][1] === "process_position_marker") {
          newColors.push("#FFFFFF");
        } else if (chartData[i][1] === "process_position_dead_line_marker") {
          newColors.push("#111111");
        } else {
          newColors.push("#008000");
        }
        colored.push(chartData[i][1]);
      }
    }
    setChartColors(newColors);

  }

  function split_setup_processes(chartData) {
    function is_setup_process(array) {
      return array[1] === "process_position_marker" || array[1] === "process_position_dead_line_marker";
    }
    
    let setup_processes_array = chartData.filter(is_setup_process);
    let new_chartData = chartData.filter(array => !is_setup_process(array));
  
    return {new_chartData, setup_processes_array};
  }

  // Funcao que anima o chart
  async function chart_animation(chartData, pageTableHistory) {
    set_chart_colors(chartData);

    let result = split_setup_processes(chartData);
    chartData = result.new_chartData
    let setupProcesses = result.setup_processes_array;

    let valid_index = 1;

    const delay = 15; // delay de atualizacao da animacao // FIXME change back to 1
    const animationStep = 40; // de quanto em quanto a barra vai crescer
    for (let i = 1; i < chartData.length; i++) {
			// update page table
			const [_, pageTableCurrent] = pageTableHistory[valid_index];
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
        const newData = [currentData[0], ...setupProcesses, ...currentData.slice(1)];
        setToChartData(newData);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if(currentProcess[1] !== "Complemento" && currentProcess[1] !== "ChaveamentoComplemento" ) {
        valid_index++;
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

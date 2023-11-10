import React, { useEffect, useState } from "react";
import { ChartComponent } from "./Chart";
// import FIFO from "./sched/FIFO";
// import SJF from "./sched/SJF";
// import RR from "./sched/RR";
// import EDF from "./sched/EDF";
import { FIFO, SJF, EDF, RoundRobin as RR } from "./sched/process";
import Convert from "./utils";
// import { render } from "react-dom";
import ReactDOM from 'react-dom/client'

export function ChartFactory({ data_from_menu, mode, quantum, switchCost }) {
  // UseState pra o array de guarda as infos do chart
  const [to_chart_data, setToChartData] = useState([]);
  const [totalTurnaround, setTotalTurnaround] = useState(0);

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
  

  // function calculateTurnaround(process) {
  //   return process.end_time - process.arrival_time;
  // }

  // Funcao que anima o chart
  async function chart_animation(chartData) {
      chartData.map((processo, index) => {
        if(index > 0){  
          processo[1] = `${processo[3]} - ${processo[4]}`
        } 
      })
      chartData.splice(1,1);
      
    const delay = 1; // delay de atualizacao da animacao
    const animationStep = 0.03; // de quanto em quanto a barra vai crescer
  
    for (let i = 0; i < chartData.length; i++) {
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

  // Roda quando a pagina carrega e faz a rotina de
  // converter chamar o FIFO nos dados e chamar 
  // animacao

  const useEffectFactory = (mode) => {
    return useEffect(() => {
			let sched_data = null;
			if (mode == "FIFO") {
				sched_data = FIFO(data_from_menu);
			} else if (mode == "SJF") {
				sched_data = SJF(data_from_menu);
			} else if (mode == "EDF") {
				sched_data = EDF(data_from_menu, quantum, switchCost);
			} else if (mode == "RR") {
				sched_data = RR(data_from_menu, quantum, switchCost);
			}

      let turnarounds = new Map();
			// init keys
			data_from_menu.forEach((process) => {
				turnarounds.set(process.pid, {
					"min_time": process.arrival_time,
					"max_time": process.arrival_time
				});
			})
			// calculate max end time for each process
			sched_data.forEach((process) => {
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
      
      let chartData = Convert(sched_data);
      chart_animation(chartData);
    }, []);
  }

  // if (mode == "FIFO") {
  //   useEffectFactory(FIFO)
  // } else if (mode == "SJF") {
  //   useEffectFactory(SJF)
  // } else if (mode == "EDF") {
  //   useEffectFactory(EDF)
  // } else if (mode == "RR") {
  //   useEffectFactory(RR)
  // }
  
	useEffectFactory(mode)

  return <ChartComponent data={to_chart_data} options={options} turnaround={totalTurnaround} />;
}

export default ChartFactory;

import React, { useEffect, useState } from "react";
import { ChartComponent } from "./Chart";
// import FIFO from "./sched/FIFO";
// import SJF from "./sched/SJF";
// import RR from "./sched/RR";
// import EDF from "./sched/EDF";
import { FIFO, SJF, EDF, RoundRobin as RR } from "./sched/process";
import Convert from "./utils";
import { render } from "react-dom";

function ChartFactory({ data_from_menu, mode, quantum, switch_cost }) {
  // Simulado os dados que virao do menu
  // const data_from_menu = [
  //   {
  //     id: 1,
  //     arrival_time: 2,
  //     duration: 2
  //   },
  //   {
  //     id: 2,
  //     arrival_time: 3,
  //     duration: 2
  //   },
  //   {
  //     id: 3,
  //     arrival_time: 3,
  //     duration: 7
  //   },
  //   {
  //     id: 4,
  //     arrival_time: 4,
  //     duration: 7
  //   },
  //   {
  //     id: 5,
  //     arrival_time: 4,
  //     duration: 12
  //   },
  //   {
  //     id: 6,
  //     arrival_time: 3,
  //     duration: 5
  //   }
  // ];

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
				sched_data = EDF(data_from_menu, quantum, switch_cost);
			} else if (mode == "RR") {
				sched_data = RR(data_from_menu, quantum, switch_cost);
			}

      let turnarounds = []
      // let turnarounds = FIFO_data.reduce((soma, process) => {
      //   if(process.pid != "Chaveamento"){
      //     return soma + process.duration;
      //   }
      //   return soma
      // }, data_from_menu[0].arrival_time)
      let acc = data_from_menu[0].arrival_time
      for (const process of data_from_menu){
        acc += process.duration
        turnarounds.push(acc - process.arrival_time)
      }
  
      let final_turnaround = 0.0
      for (const tt of turnarounds){
        final_turnaround += tt / turnarounds.length
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

document.addEventListener("DOMContentLoaded", function () {
  const rootElement = document.getElementById("gantt-root");
  const queryParams = new URLSearchParams(window.location.search);
  const dataQueryParam = queryParams.get("data");
  const mode = queryParams.get("mode");
	let quantum = null, switch_cost = null;
	if (mode == "EDF" || mode == "RR") {
		quantum = parseInt(Number());
		switch_cost = parseInt(Number(queryParams.get("switch_cost")));
	}
  const data = dataQueryParam ? JSON.parse(decodeURIComponent(dataQueryParam)) : null;
  
  render(<ChartFactory data_from_menu={data} mode={mode} quantum={quantum} switch_cost={switch_cost}/>, rootElement);
});

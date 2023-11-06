import React, { useEffect, useState } from "react";
import { ChartComponent } from "./Chart";
import FIFO from "./FIFO";
import SJF from "./SJF";
import RR from "./RR";
import Convert from "./utils";

export function App() {
  // Simulado os dados que virao do menu
  const data_from_menu = [
    {
      id: 1,
      arrival_time: 2,
      execution_time: 2
    },
    {
      id: 2,
      arrival_time: 3,
      execution_time: 2
    },
    {
      id: 3,
      arrival_time: 3,
      execution_time: 7
    },
    {
      id: 4,
      arrival_time: 4,
      execution_time: 7
    },
    {
      id: 5,
      arrival_time: 4,
      execution_time: 12
    },
    {
      id: 6,
      arrival_time: 3,
      execution_time: 5
    }
  ];

  const data_from_menu2 = [
    {
      preemption: 1,
      quantum: 4
    },
    {
      id: 1,
      arrival_time: 4,
      execution_time: 2
    },
    {
      id: 2,
      arrival_time: 3,
      execution_time: 2
    },
    {
      id: 3,
      arrival_time: 3,
      execution_time: 7
    },
    {
      id: 4,
      arrival_time: 4,
      execution_time: 7
    },
    {
      id: 5,
      arrival_time: 4,
      execution_time: 12
    },
    {
      id: 6,
      arrival_time: 3,
      execution_time: 5
    }
  ];

  // UseState pra o array de guarda as infos do chart
  const [to_chart_data, setToChartData] = useState([]);
  const [totalTurnaround, setTotalTurnaround] = useState(0);

  // Options requeridas pelo Google Chart
  let options = {
    allowHtml: true,
    enableInteractivity: false
  };

  function calculateTurnaround(process) {
    if (process.id != "Chaveamento"){
      return process.end_time - process.arrival_time;
    }
  }

  // Funcao que anima o chart
  async function chart_animation(chartData) {
    //   chartData.map((processo, index) => {
    //     if(index > 0){
    //       processo[3] = new Date(0,0,0,0,0,processo[3])
    //       processo[4] = new Date(0,0,0,0,0,processo[4])
    //     }

    // })
   
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
  useEffect(() => {
    let FIFO_data = FIFO(data_from_menu);

    let turnarounds = FIFO_data.reduce((soma, process) => {
      if(process.id != "Chaveamento"){
        return soma + calculateTurnaround(process);
      }
      return soma
    }, 0)

    turnarounds = turnarounds / (data_from_menu.length);
    setTotalTurnaround(turnarounds.toFixed(2));

    let chartData = Convert(FIFO_data);
    chart_animation(chartData);
  }, []);
 

  //Roda quando a pagina carrega e faz a rotina de
  //  converter chamar o SJF nos dados e chamar 
  //  animacao 
  // useEffect(() => {
  //   let SJF_data = SJF(data_from_menu);
  //   //RR(data_from_menu2);

  //   let turnarounds = SJF_data.reduce((soma, process) => {
  //     if(process.id != "Chaveamento"){
  //       return soma + calculateTurnaround(process);
  //     }
  //     return soma
  //   }, 0)

  //   turnarounds = turnarounds / (data_from_menu.length);
  //   setTotalTurnaround(turnarounds.toFixed(2));

  //   let chartData = Convert(SJF_data);
  //   chart_animation(chartData);
  // }, []);
  

  

  // useEffect(() => {
  //   let RR_data = RR(data_from_menu2);

  //     // Calcula o turnaround para cada processo
  //   const turnarounds = RR_data.map(process => calculateTurnaround(process));
    
  //   // Calcula o turnaround médio total
  //   let totalTurnaround = turnarounds.reduce((total, turnaround) => {
  //     if(turnaround){
  //       return total + turnaround
  //     }
  //     return total    
  //   }, 0) ;

  //   totalTurnaround = (totalTurnaround / (data_from_menu2.length - 1)).toFixed(2);
  //   setTotalTurnaround(totalTurnaround);

  //   let chartData = Convert(RR_data);
  //   chart_animation(chartData);
  // }, []);

  return <ChartComponent data={to_chart_data} options={options} turnaround={totalTurnaround} />;
}

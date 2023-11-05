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

  // Options requeridas pelo Google Chart
  var options = {
    allowHtml: true,
    enableInteractivity: false
  };

  // Funcao que anima o chart
  async function chart_animation(chartData) {
    const delay = 1; // delay de atualizacao da animacao
    const animationStep = 0.03; // de quanto em quanto a barra vai crescer
    console.log(chartData);
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

  /* Roda quando a pagina carrega e faz a rotina de
   converter chamar o FIFO nos dados e chamar 
   animacao 
  useEffect(() => {
    let FIFO_data = FIFO(data_from_menu);
    let chartData = Convert(FIFO_data);
    chart_animation(chartData);
  }, []);
  */

  /* Roda quando a pagina carrega e faz a rotina de
   converter chamar o SJF nos dados e chamar 
   animacao 
  useEffect(() => {
    let SJF_data = SJF(data_from_menu);
    RR(data_from_menu2);
    let chartData = Convert(SJF_data);
    chart_animation(chartData);
  }, []);
  */

  useEffect(() => {
    let RR_data = RR(data_from_menu2);

    let chartData = Convert(RR_data);
    chart_animation(chartData);
  }, []);
  return <ChartComponent data={to_chart_data} options={options} />;
}

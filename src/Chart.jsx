import React, { useLayoutEffect } from "react";
import { Chart } from "react-google-charts";
import MemTable from "./MemTable"
import "../styles/gantt.css"

export const ChartComponent = ({ data, pageTable, options, turnaround, pageFaults }) => {
  
  useLayoutEffect(() => {
    // Obtém todos os elementos <text> no documento
     let labels = document.getElementsByTagName('text');
 
     // Encontrar as duas primeiras <text> com fill="#000000"
     let first_label = null;
     let second_label = null;
 
     for (let i = 0; i < labels.length; i++) {
         if (labels[i].getAttribute('fill') === "#000000") {
             if (first_label === null) {
                 first_label = parseFloat(labels[i].textContent);
             } else if (second_label === null) {
                 second_label = parseFloat(labels[i].textContent);
                 break;
             }
         }
     }
 
     // Verifica se encontrou as duas primeiras labels
     if (first_label !== null && second_label !== null) {
         // Calcula a diferença entre as duas primeiras labels
         let difference = second_label - first_label;
         let value = first_label;
         // Itera sobre as labels com fill="#000000" e atualiza os valuees
         for (let i = 0; i < labels.length; i++) {
             if (labels[i].getAttribute('fill') === "#000000") {
                 // Atualiza o conteúdo incrementalmente
                 labels[i].textContent = (value).toString();
                 value += difference;
             }
         }
     }
   }, [data, pageTable, options, turnaround]);
 
  
  return (
    <>
      <p className="turnaround-text">Turnaround: {turnaround}</p>
			<p className="page-faults-text">Total de page faults: {pageFaults}</p>

      <Chart
        chartType="Timeline"
        data={data}
        width="100%"
        height="600px"
        options={options}
      />
			<MemTable pageTable={pageTable}/>
    </>
  );
};

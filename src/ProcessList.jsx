import React from 'react';

export function ProcessList() {
  var process_table = JSON.parse(localStorage.getItem("process_table"));
  return (
    <div>
    <h2>Processos criados</h2>
      {process_table !== null?
       <ul>
         {
             process_table.map((process) => (
               <li key={process.pid}>
               <strong>[PID {process.pid}]</strong> Chegada: {process.arrival_time} Tempo de execução: {process.duration} Prioridade: {process.priority} Deadline: {process.deadline}
               </li>
             ))
         }
       </ul>
       :
       ""}
    </div>
  );
}

export default ProcessList;

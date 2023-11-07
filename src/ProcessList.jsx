import React from 'react';

export function ProcessList() {
  var process_table = JSON.parse(sessionStorage.getItem("process_table"));
  console.log(process_table)
  return (
    <div className="process-list">
    <h2>Processos criados</h2>
      {process_table !== null?
       <ul className="list">
         {
             process_table.map((process) => (
               <li key={process.pid}>
                 <div className="process">
                   <div className="process-identification">
                     <strong>Processo {process.pid}</strong>
                   </div>
                   <div className="process-description-container">
                     <table className="process-description-table">
                       <tbody>
                        <tr>
                          <td>Chegada:</td>
                          <td>{process.arrival_time}</td>
                        </tr>
                        <tr>
                          <td>Duração:</td>
                          <td>{process.duration}</td>
                        </tr>
                        <tr>
                          <td>Prioridade:</td>
                          <td>{process.priority}</td>
                        </tr>
                        <tr>
                          <td>Deadline:</td>
                          <td>{process.deadline}</td>
                        </tr>
                       </tbody>
                   </table>
                   </div>
                 </div>
               </li>
             ))
         }
       </ul>
       :
       <h2 style={{textAlign: "center", color:"#AAA"}}>
         Nenhum processo criado
      </h2>}
    </div>
  );
}

export default ProcessList;

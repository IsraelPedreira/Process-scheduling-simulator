import React from 'react';

export function ProcessList(props) {
  let process_table = props.processTable
  let sessionProcessTable = sessionStorage.getItem("process_table");

  if (sessionProcessTable != null) {
    // Se nossa lista está vazia mas existe uma lista na sessionStorage, carregar.
    process_table = JSON.parse(sessionProcessTable)
  }

  console.log("process table in pList is ", process_table)
  return (
    <div className="process-list">
    <h2>Processos criados</h2>
      {process_table.length > 0 ?
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

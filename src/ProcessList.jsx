import React from 'react';

export function ProcessList(props) {
  let process_table = props.processTable

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
                        <tr>
                          <td>Páginas:</td>
                          <td>{process.pages}</td>
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

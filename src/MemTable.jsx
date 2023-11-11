import React from 'react';
import ReactDOM from 'react-dom/client'
import '../styles/gantt.css'

const memory_size = 50; // see specification
const process_size = 4; // FIXME make it customizable

export function MemTable() {
  const processes = JSON.parse(sessionStorage.getItem("process_table"));
  let memlist = []

  if (processes == null){
    alert("Processos não foram lidos corretamente.")
    return;
  }

  // Preencher memória com cada processo `process_size` vezes.
  for (let i = 0; i <= memory_size; i++){
    let process = processes[Math.floor(i/process_size)];
    memlist.push(process == null? null : process)
  }

  return (
    <div className="ram-bg">
      <div className="ram-title">
        Memória RAM
      </div>
      <ul className="ram-list">
        {
          memlist.map(
            (process, idx) => <li key={idx}>{process == null ? '' : process.pid}</li>
          )
        }
      </ul>
    </div>
  );
}

export default MemTable;

import React from 'react';
import ReactDOM from 'react-dom/client'
import '../styles/entry.css'

const memory_size = 50; // see specification
const process_size = 4; // FIXME make it customizable

export function MemTable() {
  const processes = JSON.parse(sessionStorage.getItem("process_table"));

  let mem_layout = [];

  // this is temporary
  processes.forEach((process) => {
    for (let s = 0; s < process_size; s++){
      mem_layout.push(process);
    }
  })

  let mem_size = memory_size-process_size*processes.length

  for (let i = 0; i < mem_size; i++){
    mem_layout.push({pid:"x"});
  }

  return (
	<div className="ram-bg">
      <div className="ram-title">
        Memória RAM
      </div>

      <ul className="ram-list">
        {
          mem_layout.map((process) => (
            <li key={process.id}>{process.pid}</li>
          ))
        }
      </ul>
	</div>
  );
}

export default MemTable;

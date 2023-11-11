import React from 'react';
import ReactDOM from 'react-dom/client'
import '../styles/entry.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export function MemTable({ pageTable }) {
  function noCountX(array) {
    let count = 0;
    for (const elemento of array) {
        if (elemento !== 'x') {
            count++;
        }
    }
    return count;
  }
  const percentage = Number((noCountX(pageTable)/50)*100).toFixed(2)

  return (
	<div className="ram-bg">
    <div>
      <div className="ram-title">
        Memória RAM
      </div>
      <ul className="ram-list">
        {
          pageTable.map((pid, index) => (
            <li key={index}>{pid}</li>
          ))
        }
      </ul>
    </div>
      <div style={{ width: 100, height: 100 }}>
        <CircularProgressbar value={percentage} text={`${percentage}%`} />
      </div>
	</div>
  )
}

export default MemTable;

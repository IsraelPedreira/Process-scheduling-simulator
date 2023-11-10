import React from 'react';
import ReactDOM from 'react-dom/client'
import '../styles/entry.css'

export function MemTable({ pageTable }) {
  return (
	<div className="ram-bg">
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
  );
}

export default MemTable;

import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import './entry.css'

function MemTable() {
  return (
	<div className="ramtable">
	  <div className="ramtable-title">
        <center>
          Memória RAM
        </center>
	  </div>
      <table>
        <thead/>
        <tbody>
        <tr>
          <td>a</td>
          <td>b</td>
          <td>c</td>
        </tr>
        <tr>
          <td>d</td>
          <td>e</td>
          <td>f</td>
        </tr>
        <tr>
          <td>g</td>
          <td>h</td>
          <td>i</td>
        </tr>
        </tbody>
      </table>
	</div>
  );
}

ReactDOM.createRoot(document.getElementById('mem-table-root')).render(
    <MemTable />
)

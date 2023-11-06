import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import './entry.css'
import './GanttChart.css'
import { ProcessForm } from './ProcessForm.jsx'
import { ProcessList } from './ProcessList.jsx'
import { ProcessTable } from './ProcessTable.jsx'

function App() {
    const {processTable, updateProcessTable} = ProcessTable();
    console.log("Process table:", processTable);
    return (
		<div className="entry">
		  <div className="entry-form">
			<ProcessForm processTable={processTable} updateProcessTable={updateProcessTable}/> {/* Render the ProcessForm component here */}
		  </div>
          <div className="entry-list">
            <ProcessList processes={processTable}/>
		 </div>
		 </div>
    );
}

ReactDOM.createRoot(document.getElementById('entry-root')).render(
    <App />
)

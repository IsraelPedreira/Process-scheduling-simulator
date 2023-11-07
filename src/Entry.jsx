import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import './entry.css'
import { ProcessForm } from './ProcessForm.jsx'
import { ProcessList } from './ProcessList.jsx'

function App() {
    const [processTable, updateProcessTable] = useState([]);
    console.log("Process table:", processTable);
    return (
		<div className="entry">
		  <div className="entry-form">
			  <ProcessForm processTable={processTable} updateProcessTable={updateProcessTable}/> {/* Render the ProcessForm component here */}
      </div>
        <div className="entry-list">
          <ProcessList processTable={processTable}/>
        </div>
		 </div>
    );
}

ReactDOM.createRoot(document.getElementById('entry-root')).render(
    <App />
)

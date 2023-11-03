import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import './entry.css'
import './GanttChart.css'
import { ProcessForm } from './ProcessForm.jsx'

function App() {
  return (
		<div className="entry" style={{width: "50%", left: 0}}>
			<div className="entry-form">
				<div className="entry-header">
					<h1>Process Form App</h1>
				</div>
				<ProcessForm /> {/* Render the ProcessForm component here */}
			</div>
			<div className="entry-view">
			</div>
		</div>
  );
}

ReactDOM.createRoot(document.getElementById('entry-root')).render(
    <App />
)

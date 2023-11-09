import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import './entry.css'
import { ProcessForm } from './ProcessForm.jsx'
import { ProcessList } from './ProcessList.jsx'
import { ProcessFooter } from './ProcessFooter.jsx'

const safeEquality = (table1, table2) => {
	let equal = true;
	if (table1.length !== table2.length){
		return false
	} else {
		for (let i = 0; i < table1.length; i++){
			equal = equal & (table1[i].pid === table2[i].pid) 
							& (table1[i].arrival_time === table2[i].arrival_time)
							& (table1[i].duration === table2[i].duration)
							& (table1[i].priority === table2[i].priority)
							& (table1[i].deadline === table2[i].deadline)
		}
		return equal
	}
}

function EntryPage() {
	// initialize state 
	const [processTable, updateProcessTable] = useState([]);
	const [quantum, setQuantum] = useState("");
	const [switchCost, setSwitchCost] = useState("");

	// initialize cache
	if (sessionStorage.getItem("process_table") === null){
		sessionStorage.setItem("process_table", JSON.stringify(processTable))
	}
	if (sessionStorage.getItem("quantum") === null){
		sessionStorage.setItem("quantum", quantum)
	}
	if (sessionStorage.getItem("switch_cost") === null){
		sessionStorage.setItem("switch_cost", switchCost)
	}

	// read cache
	if (safeEquality(processTable, JSON.parse(sessionStorage.getItem("process_table"))) === false){
		const cached_process_table = JSON.parse(sessionStorage.getItem("process_table"))
		updateProcessTable(cached_process_table)
	}
	if (sessionStorage.getItem("quantum") != quantum){
		setQuantum(sessionStorage.getItem("quantum"))
	}
	if (sessionStorage.getItem("switch_cost") != switchCost){
		setSwitchCost(sessionStorage.getItem("switch_cost"))
	}

	return (
	<div className="entry">
		<div className="entry-form">
			<ProcessForm processTable={processTable} updateProcessTable={updateProcessTable} 
				quantum={quantum} setQuantum={setQuantum} switchCost={switchCost} setSwitchCost={setSwitchCost}/> {/* Render the ProcessForm component here */}
		</div>
			<div className="entry-list">
				<ProcessList processTable={processTable}/>
			</div>
			<div className="entry-footer">
				<ProcessFooter quantum={quantum} switchCost={switchCost}/>
			</div>
	 </div>
	);
}

ReactDOM.createRoot(document.getElementById('entry-root')).render(
    <EntryPage />
)

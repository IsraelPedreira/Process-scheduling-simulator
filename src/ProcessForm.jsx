import React, { useState, useEffect, Component } from 'react';

// const max_priority = 5
// const max_deadline = 100

// function generateTask(process_table, pid = -1, arrival_time = 0, duration = 50, priority = 1, deadline = 100, randomize = true) {
// 	if (randomize){
// 		arrival_time = Math.floor(Math.random() * 100)
// 		duration = Math.floor(Math.random() * (100 - arrival_time))
// 		priority = Math.floor(Math.random() * max_priority)
// 		deadline = Math.floor(Math.random() * max_deadline)
// 	}
// 	if (pid === -1){
// 		pid = process_table.length + 1
// 	}
// 	const newTask = {
// 		"pid": pid,
// 		"arrival_time": arrival_time,
// 		"duration": duration, // random duration from 0 to 100 - arrival_time (TOTAL RANGE: 0-100)
// 		"priority": priority,
// 		"deadline": deadline
// 	};
// 	process_table.push(newTask);
// 	return process_table;
// }

function AddProcess(process_table, pid, arrival_time, duration, priority, deadline){
	process_table.push({
		"pid": pid,
		"arrival_time": arrival_time,
		"duration": duration,
		"priority": priority,
		"deadline": deadline
	})
	return process_table
}

export function ProcessForm(props) {
  const [formData, setFormData] = useState({
    pid: '',
    arrival_time: '',
    duration: '',
    priority: '',
    deadline: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
	// particular to processForm, since it represents unsubmitted quantum and swithcost values
	const [tempQuantum, setTempQuantum] = useState("");
	const [tempSwitchCost, setTempSwitchCost] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader()

    reader.onload = (event) => {
      const content = event.target.result;
      // parse as JSON
			try {
				const parsedContent = JSON.parse(content);
				const pids = parsedContent["process_table"].map((process) => process.pid);
				if (pids.length > 8){
					alert("O limite máximo de processos são 8.");
					return;
				} else if ((new Set(pids)).size !== pids.length){
					// duplicate PIDs
					alert("Erro: PIDs duplicados");
					return;
				}
				props.updateProcessTable(parsedContent);
				props.setQuantum(parsedContent["quantum"]);
				props.setSwitchCost(parsedContent["switch_cost"]);
				// cache it!
				sessionStorage.setItem("process_table", JSON.stringify(parsedContent["process_table"]));
				sessionStorage.setItem("quantum", parsedContent["quantum"]);
				sessionStorage.setItem("switch_cost", parsedContent["switch_cost"]);
			} catch (error) {
				alert("Formato inválido: forneça um arquivo JSON válido.")
				return;
			}
    }
    try {
      reader.readAsText(file)
      setSelectedFile(file)
    } catch (error) {
      alert("Formato inválido: forneça um arquivo JSON válido.")
    }
  }

  const handleAddProcess = (event) => {
    event.preventDefault();
    
    if (props.processTable.length >= 8) {
      alert("O limite máximo de processos são 8.");
      return;
    }

    if (props.processTable.find((process) => process.pid == formData.pid)){
        alert("Um processo de PID " + formData.pid + " já existe")
        return;
    }

    console.log('Form data submitted:', formData);
		const _updated = AddProcess([...props.processTable], ...Object.values(formData).map(x => parseInt(x)))
    props.updateProcessTable(_updated);
		// cache it!
		sessionStorage.setItem("process_table", JSON.stringify(_updated));
		// reset form
		setFormData({
			pid: '',
			arrival_time: '',
			duration: '',
			priority: '',
			deadline: '',
		});
  }

	const handleSetQuantum = () => {
		props.setQuantum(tempQuantum);
		sessionStorage.setItem("quantum", tempQuantum);
	}

	const handleSetSwitchCost = () => {
		props.setSwitchCost(tempSwitchCost);
		sessionStorage.setItem("switch_cost", tempSwitchCost);
	}

  const handleOnSubmitFactory = (mode) => {
		const handleOnSubmitMode = (event) => {
			event.preventDefault();
			if (!props.processTable){
				alert("Erro: informe pelo menos um processo");
			} else if ((!props.quantum || !props.switchCost) && (mode == "EDF" || mode == "RR")) {
				alert(`Erro: para visualizar o algoritmo de escalonamento ${mode} informe o quantum e a sobrecarga de chaveamento.`);	
			} else {
				// Serialize the data as a query parameter
				const dataQueryParam = encodeURIComponent(JSON.stringify(props.processTable));
			
				// Navigate to the new HTML page with the data as a query parameter
				window.location.href = `gantt.html?quantum=${props.quantum}&switchCost=${props.switchCost}&mode=${mode}&data=${dataQueryParam}`;
			}
		}
	return handleOnSubmitMode 
  }
  const handleOnClear = (event) => {
    event.preventDefault();

    props.updateProcessTable([]);
    sessionStorage.removeItem("process_table")
  }

  return (
    <div className="process-form-container">
      <h2>Criar novo processo</h2>
      <form>
        <div>
          <label htmlFor="pid">PID:</label>
          <input
            type="text"
            id="pid"
            name="pid"
            value={formData.pid}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="arrival_time">Chegada:</label>
          <input
            type="text"
            id="arrival_time"
            name="arrival_time"
            value={formData.arrival_time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="duration">Duração:</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="priority">Prioridade:</label>
          <input
            type="text"
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="text"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>
				<div className="quantumEntry">
					<label htmlFor="quantum">Quantum:</label>
					<input
						type="text"
						id="quantum"
						name="quantum"
						value={tempQuantum}
						onChange={(event) => setTempQuantum(event.target.value)}
					/>
					<button onClick={handleSetQuantum}>Confirmar</button>
				</div>
				<div className="switchCostEntry">
					<label htmlFor="switchCost">Sobrecarga de Chaveamento:</label>
					<input
						type="text"
						id="switchCost"
						name="switchCost"
						value={tempSwitchCost}
						onChange={(event) => setTempSwitchCost(event.target.value)}
					/>
					<button onClick={handleSetSwitchCost}>Confirmar</button>
				</div>
        <div className="exit-buttons">
          <button onClick={handleAddProcess} type="submit">Adicionar</button>
          <button onClick={handleOnSubmitFactory("FIFO")} type="submit">FIFO</button>
          <button onClick={handleOnSubmitFactory("SJF")} type="submit">SJF</button>
          <button onClick={handleOnSubmitFactory("EDF")} type="submit">EDF</button>
          <button onClick={handleOnSubmitFactory("RR")} type="submit">RR</button>
        </div>
        <div className="file-submit">
          <input type="file" accept=".json" onChange={handleFileChange}></input>
        </div>
				<div className="clear-button">
					<button onClick={handleOnClear} type="submit">Limpar</button>
				</div>
      </form>
    </div>
  );
}

export default ProcessForm;
// <button onClick={this.handleOnSave} type="submit">Save</button>

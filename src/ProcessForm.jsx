import React, { useState, useEffect, Component } from 'react';

const MAX_PROCESSES = 12

function AddProcess(process_table, pid, arrival_time, duration, priority, deadline, pages){
	process_table.push({
		"pid": pid,
		"arrival_time": arrival_time,
		"duration": duration,
		"priority": priority,
		"deadline": deadline,
		"pages": pages
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
		pages: '',
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

	const handlePageList = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value.split(",")
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
				if (pids.length > MAX_PROCESSES){
					alert(`O limite máximo de processos são ${MAX_PROCESSES}.`);
					return;
				} else if ((new Set(pids)).size !== pids.length){
					// duplicate PIDs
					alert("Erro: PIDs duplicados");
					return;
				}
				props.updateProcessTable(parsedContent["process_table"]);
				props.setQuantum(parsedContent["quantum"]);
				props.setSwitchCost(parsedContent["switch_cost"]);
				props.setSchedMode(parsedContent["sched_mode"]);
				props.setMemMode(parsedContent["mem_mode"]);
				console.log(props.processTable, props.quantum, props.switchCost, props.schedMode, props.memMode)
				// cache it!
				sessionStorage.setItem("process_table", JSON.stringify(parsedContent["process_table"]));
				sessionStorage.setItem("quantum", parsedContent["quantum"]);
				sessionStorage.setItem("switch_cost", parsedContent["switch_cost"]);
				sessionStorage.setItem("sched_mode", parsedContent["sched_mode"]);
				sessionStorage.setItem("mem_mode", parsedContent["mem_mode"]);
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
    
    if (props.processTable.length >= MAX_PROCESSES) {
      alert(`O limite máximo de processos são ${MAX_PROCESSES}.`);
      return;
    }

    if (props.processTable.find((process) => process.pid == formData.pid)){
        alert("Um processo de PID " + formData.pid + " já existe")
        return;
    }

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
      pages: ''
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

	const handleSetSchedMode = (event) => {
		event.preventDefault();
		// id of buttons informs mode!
		const mode = event.target.value;
		props.setSchedMode(mode);
		sessionStorage.setItem("sched_mode", mode);
	}
	
	const handleSetMemMode = (event) => {
		event.preventDefault();
		// id of buttons informs mode!
		const mode = event.target.value;
		props.setMemMode(mode);
		sessionStorage.setItem("mem_mode", mode);
	}

	const handleOnSubmit = (event) => {
		event.preventDefault();
		console.log('Form data submitted:', props.processTable);
		if (props.processTable.length == 0){
			alert("Erro: informe pelo menos um processo");
		} else if ((!props.quantum || !props.switchCost) && (props.schedMode == "EDF" || props.schedMode == "RR")) {
			alert(`Erro: para visualizar o algoritmo de escalonamento ${mode} informe o quantum e a sobrecarga de chaveamento.`);	
		} else {
			// Serialize the data as a query parameter
			const dataQueryParam = encodeURIComponent(JSON.stringify(props.processTable));
		
			// Navigate to the new HTML page with the data as a query parameter
			// TODO MAKE MEMMODE CUSTOMIZABLE
			window.location.href = `gantt.html?quantum=${props.quantum}&switchCost=${props.switchCost}&schedMode=${props.schedMode}&memMode=${props.memMode}&data=${dataQueryParam}`;
		}
	}

  const handleOnClear = (event) => {
    event.preventDefault();

    props.updateProcessTable([]);
		props.setQuantum("");
		props.setSwitchCost("");
		props.setSchedMode("FIFO");
		props.setMemMode("FIFO");
		sessionStorage.setItem("process_table", JSON.stringify([]));
		sessionStorage.setItem("quantum", "");
		sessionStorage.setItem("switch_cost", "");
		sessionStorage.setItem("sched_mode", "");
		sessionStorage.setItem("mem_mode", "");
  }

  return (
    <div className="process-form-container">
      <h2>Criar novo processo</h2>
      <form>
        <div className='mainDivAddProcess'>
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
          <div>
            <label htmlFor="pages">Páginas utilizadas (lista separada por vírgulas, sem espaços):</label>
            <input
              type="text"
              id="pages"
              name="pages"
              value={formData.pages}
              onChange={handlePageList}
            />
          </div>
          <button onClick={handleAddProcess} className='formButton' type="submit">Adicionar</button>
        </div>
        <div className='separator'></div>
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
        <div className='separator'></div>
        <div className="exit-buttons">
					<h2 className="sched-options-text">Algoritmos de Escalonamento</h2>
          <button onClick={handleSetSchedMode} className='schedButton' value="FIFO" id="FIFO">FIFO</button>
          <button onClick={handleSetSchedMode} className='schedButton' value="SJF" id="SJF">SJF</button>
          <button onClick={handleSetSchedMode} className='schedButton' value="EDF" id="EDF">EDF</button>
          <button onClick={handleSetSchedMode} className='schedButton' value="RR" id="RR">RR</button>
        </div>
        <div className="exit-buttons">
					<h2 className="mem-options-text">Algoritmos de Paginação</h2>
          <button onClick={handleSetMemMode} className='memButton' value="FIFO" id="FIFO">FIFO</button>
          <button onClick={handleSetMemMode} className='memButton' value="LRU" id="LRU">LRU</button>
        </div>
        <div className="file-submit">
          <input type="file" accept=".json" onChange={handleFileChange}></input>
        </div>
					<div style={{overflow: "hidden"}}>
						<div className="clear-button">
							<button onClick={handleOnClear}>Limpar</button>
						</div>
						<div className="submit-button">
							<button onClick={handleOnSubmit}>Iniciar</button>
						</div>
				</div>
      </form>
    </div>
  );
}

export default ProcessForm;
// <button onClick={this.handleOnSave} type="submit">Save</button>

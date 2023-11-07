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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleAddProcess = (event) => {
    event.preventDefault();
    let sessionProcessTable = sessionStorage.getItem("process_table") !== null
        ? JSON.parse(sessionStorage.getItem("process_table"))
        : props.processTable;

    if (props.processTable.length >= 8) {
      alert("O limite máximo de processos são 8.");
      return;
    }

    if (props.processTable.find((process) => process.pid == formData.pid)){
        alert("Um processo de PID " + formData.pid + " já existe")
        return;
    }

    for (const key in formData) {
      const value = formData[key];
    //   if (isNaN(value) || parseInt(Number(value)) !== value) {
    //     alert("Please enter a number for " + key);
    //     return;
    //   }
    }

    console.log('Form data submitted:', formData);
    props.updateProcessTable(AddProcess(sessionProcessTable, ...Object.values(formData).map(x => parseInt(x))));
    sessionStorage.setItem("process_table", JSON.stringify(sessionProcessTable));
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();
    console.log("final process table is", sessionStorage.getItem("process_table"));
    window.location.href = "gantt.html";
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
        <div className="exit-buttons">
          <button onClick={handleAddProcess} type="submit">Adicionar</button>
          <button onClick={handleOnSubmit} type="submit">Mostrar</button>
        </div>
      </form>
    </div>
  );
}

export default ProcessForm;
// <button onClick={this.handleOnSave} type="submit">Save</button>

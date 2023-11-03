import React, { useState, useEffect, Component } from 'react';
import { AddProcess } from './sched/process'

const max_priority = 5
const max_deadline = 100

class ProcessTableWrapper {
	constructor(){
		this.process_table = []
	}

	push(obj){
		this.process_table.push(obj)
	}
}

// export const process_table = new ProcessTableWrapper()
const process_table = []

function generateTask(pid = -1, arrival_time = 0, duration = 50, priority = 1, deadline = 100, randomize = true) {
	if (randomize){
		arrival_time = Math.floor(Math.random() * 100)
		duration = Math.floor(Math.random() * (100 - arrival_time))
		priority = Math.floor(Math.random() * max_priority)
		deadline = Math.floor(Math.random() * max_deadline)
	}
	if (pid = -1){
		pid = process_table.length + 1
	}
	const newTask = {
		"pid": pid,
		"arrival_time": arrival_time,
		"duration": duration, // random duration from 0 to 100 - arrival_time (TOTAL RANGE: 0-100)
		"priority": priority,
		"deadline": deadline
	};
	process_table.push(newTask);
	return process_table;
}

export class ProcessForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"pid": '',
			"arrival_time": '',
			"duration": '',
			"priority": '',
			"deadline": '',
		};
	}

	handleChange = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	}

	handleAddProcess = (event) => {
		event.preventDefault();
		// You can handle the form submission here, e.g., send the data to an API or process it further.
		for (const key in this.state) {
			const value = this.state[key]
			if (isNaN(value) || parseInt(Number(value)) != value){
				alert("Please enter a number for " + key)
			}
		}
		console.log('Form data submitted:', this.state);
		AddProcess(process_table, ...Object.values(this.state).map(x => parseInt(x)))
		console.log("process table is", process_table)
	}

	handleOnSubmit = (event) => {
		event.preventDefault();
		console.log("final process table is", process_table)
		localStorage.setItem("process_table", JSON.stringify(process_table))
		window.location.href = "gantt.html" 
	}

	render() {
		return (
			<div className="process-form-container">
				<h2>Enter Process Details</h2>
				<form>
					<div>
						<label htmlFor="pid">PID:</label>
						<input
							type="text"
							id="pid"
							name="pid"
							value={this.state.pid}
							onChange={this.handleChange}
						/>
					</div>
					<div>
						<label htmlFor="arrival_time">Arrival Time:</label>
						<input
							type="text"
							id="arrival_time"
							name="arrival_time"
							value={this.state.arrival_time}
							onChange={this.handleChange}
						/>
					</div>
					<div>
						<label htmlFor="duration">Duration:</label>
						<input
							type="text"
							id="duration"
							name="duration"
							value={this.state.duration}
							onChange={this.handleChange}
						/>
					</div>
					<div>
						<label htmlFor="priority">Priority:</label>
						<input
							type="text"
							id="priority"
							name="priority"
							value={this.state.priority}
							onChange={this.handleChange}
						/>
					</div>
					<div>
						<label htmlFor="deadline">Deadline:</label>
						<input
							type="text"
							id="deadline"
							name="deadline"
							value={this.state.deadline}
							onChange={this.handleChange}
						/>
					</div>
					<div className="exit-buttons">
						<button onClick={this.handleAddProcess} type="submit">Add task</button>
						<button onClick={this.handleOnSubmit} type="submit">Show</button>
					</div>
				</form>
			</div>
		);
	}
}

// <button onClick={this.handleOnSave} type="submit">Save</button>

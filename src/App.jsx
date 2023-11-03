import React, { useState, useEffect, Component } from 'react';
import GanttChart from './GanttChart'; // Import your GanttChart component

const max_priority = 5
const max_deadline = 100

class ProcessForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pid: '',
			arrival_time: '',
			duration: '',
			priority: '',
			deadline: '',
		};
	}

	handleChange = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	}

	handleSubmit = (event) => {
		event.preventDefault();
		// You can handle the form submission here, e.g., send the data to an API or process it further.
		console.log('Form data submitted:', this.state);
	}

	render() {
		return (
			<div className="process-form-container">
				<h2>Enter Process Details</h2>
				<form onSubmit={this.handleSubmit}>
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
						<button type="submit">Add task</button>
						<button>Show</button>
					</div>
				</form>
			</div>
		);
	}
}


// gantt builder (GanttChart component)
const GanttBuilder = () => {
  // const [tasks, setTasks] = useState([
  //   { id: 1, name: 'Task 1', duration: '50%' },
  //   { id: 2, name: 'Task 2', duration: '30%' },
  //   { id: 3, name: 'Task 3', duration: '70%' },
  // ]);
	const [tasks, setTasks] = useState([]);
  const generateTask = (_event, arrival_time = 0, duration = 50, priority = 1, deadline = 100, randomize = true) => {
		if (randomize){
			arrival_time = Math.floor(Math.random() * 100)
			duration = Math.floor(Math.random() * (100 - arrival_time))
			priority = Math.floor(Math.random() * max_priority)
			deadline = Math.floor(Math.random() * max_deadline)
		}
    const newTask = {
      "pid": tasks.length + 1,
			"arrival_time": arrival_time,
      "duration": duration, // random duration from 0 to 100 - arrival_time (TOTAL RANGE: 0-100)
			"priority": priority,
			"deadline": deadline
    };
    setTasks([...tasks, newTask]);
  };

	// useEffect(() => {
	//   // Automatically add a task when the component mounts
	//   addTask();
	// }, []);
  return (
    <div className="App">
      <button onClick={generateTask}>Add Task</button>
      <GanttChart tasks={tasks} />
    </div>
  );
};

export { GanttBuilder, ProcessForm };

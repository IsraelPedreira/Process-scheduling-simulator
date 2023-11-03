import React, { useState, useEffect, Component } from 'react';
import ReactDOM from 'react-dom/client'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { process_table } from './ProcessForm.jsx';
import './GanttChart.css'; // Import your CSS styles

// if task duration = k (percent) then time = animation duration / speed 
const speed = 10 // 10% per second

const process_table = JSON.parse(localStorage.getItem("process_table"))

function GanttChart({ tasks }) {
  return (
	  // timeout is the maximum duration of animation before it is removed from the DOM
    <div className="gantt-container">
      <TransitionGroup>
        {tasks.map((task) => (
			<div key={task["pid"]} style={{
				position: "relative",
				width: `${task["duration"]}%`,
				left: `${task["arrival_time"]}%`,
			}}>
			  <CSSTransition timeout={120_000} classNames="task">
				<div className="gantt-bar"
				style={{
					animation: `progress ${task["duration"] / speed}s linear`
				}}>
				  {task["pid"]}
				</div>
			  </CSSTransition>
			</div>
        ))}
      </TransitionGroup>
    </div>
  );
}

// pass data via the property (prop) tasks
ReactDOM.createRoot(document.getElementById('gantt-root')).render(
  <GanttChart tasks={process_table}/>
)

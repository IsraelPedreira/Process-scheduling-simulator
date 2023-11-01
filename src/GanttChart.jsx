import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './GanttChart.css'; // Import your CSS styles

// if task duration = k (percent) then time = animation duration / speed 
const speed = 10 // 10% per second

const GanttChart = ({ tasks }) => {
  return (
	  // timeout is the maximum duration of animation before it is removed from the DOM
    <div className="gantt-container">
      <TransitionGroup>
        {tasks.map((task) => (
			<div key={task.id} style={{width: `${task.duration}%`}}>
			  <CSSTransition timeout={10000} classNames="task">
				<div className="gantt-bar"
				style={{
					animation: `progress ${task.duration / speed}s linear`
				}}>
				  {task.name}
				</div>
			  </CSSTransition>
			</div>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default GanttChart;

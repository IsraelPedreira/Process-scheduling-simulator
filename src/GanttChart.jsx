import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './GanttChart.css'; // Import your CSS styles

const GanttChart = ({ tasks }) => {
  return (
    <div className="gantt-container">
      <TransitionGroup>
        {tasks.map((task) => (
          <CSSTransition key={task.id} timeout={100} classNames="task">
            <div className="gantt-bar" style={{ width: task.duration }}>
              {task.name}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default GanttChart;

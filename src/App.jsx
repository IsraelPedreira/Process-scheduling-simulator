import React, { useState, useEffect } from 'react';
import GanttChart from './GanttChart'; // Import your GanttChart component

// app builder (add-task button and GanttChart component)
const App = () => {
  // const [tasks, setTasks] = useState([
  //   { id: 1, name: 'Task 1', duration: '50%' },
  //   { id: 2, name: 'Task 2', duration: '30%' },
  //   { id: 3, name: 'Task 3', duration: '70%' },
  // ]);
	const [tasks, setTasks] = useState([]);
  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: `Task ${tasks.length + 1}`,
      duration: '40%',
    };
    setTasks([...tasks, newTask]);
  };


  useEffect(() => {
    // Automatically add a task when the component mounts
    addTask();
  }, []);

  return (
    <div className="App">
      <button onClick={addTask}>Add Task</button>
      <GanttChart tasks={tasks} />
    </div>
  );
};

export default App;

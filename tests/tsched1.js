// import process_table from "../src/process.js";
// import AddProcess from "../src/process.js";
// import FIFO from "../src/process.js";
// import SJF from "../src/process.js";
import {AddProcess, FIFO, SJF, EDF, RoundRobin} from "../src/sched/process.js";

const process_table = []

function generateRandomProcessData(count, maxArrivalTime=10, maxDuration=5, maxDeadline=30, maxPriority=5) {
  const processes = [];

  for (let i = 1; i <= count; i++) {
    const process = {
      "pid": i,
      "arrival_time": Math.floor(Math.random() * maxArrivalTime),
      "duration": Math.floor(Math.random() * maxDuration) + 1, // Ensure duration is at least 1
      "priority": Math.floor(Math.random() * maxPriority),
      "deadline": Math.floor(Math.random() * maxDeadline),
    };
    processes.push(process);
  }

  return processes;
}

// Generate 5 random processes
const processData = generateRandomProcessData(5);

// const processData =
// [
//   { PID: 1, arrivalTime: 3, duration: 3, deadline: 23, priority: 1 },
//   { PID: 2, arrivalTime: 8, duration: 4, deadline: 18, priority: 2 },
//   { PID: 3, arrivalTime: 4, duration: 1, deadline: 22, priority: 1 },
//   { PID: 4, arrivalTime: 0, duration: 5, deadline: 16, priority: 2 },
//   { PID: 5, arrivalTime: 5, duration: 2, deadline: 1, priority: 3 }
// ]
// const processData =
// [
//   { pid: 1, arrival_time: 4, duration: 3, priority: 3, deadline: 8 },
//   { pid: 2, arrival_time: 0, duration: 3, priority: 3, deadline: 19 },
//   { pid: 3, arrival_time: 9, duration: 2, priority: 0, deadline: 15 },
//   { pid: 4, arrival_time: 3, duration: 1, priority: 3, deadline: 13 },
//   { pid: 5, arrival_time: 2, duration: 5, priority: 3, deadline: 4 }
// ]

console.log("process raw data", processData);

// Add each process to the process table
processData.forEach((process) => {
	AddProcess(process_table, process["pid"], process["arrival_time"], process["duration"], process["priority"], process["deadline"]);
});

// Run the FIFO algorithm
const fifo_result = FIFO(process_table)
console.log("FIFO result:")
console.log(fifo_result)
// Run the SJF algorithm
const sjf_result = SJF(process_table)
console.log("SJF result:")
console.log(sjf_result)
// Run the EDF algorithm
const edf_result = EDF(process_table)
console.log("EDF result:")
console.log(edf_result)
// Run the Round Robin algorithm
const rr_result = RoundRobin(process_table, 2)
console.log("RR result:")
console.log(rr_result)

import Denque from 'denque'

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

// function _DeepCopyProcess(process){
// 	const copy_process = {
// 		"pid": process["pid"],
// 		"arrival_time": process["arrival_time"],
// 		"duration": process["duration"],
// 		"priority": process["priority"],
// 		"deadline": process["deadline"]
// 	}
// 	return copy_process
// }

class SortedProcessArray{
	// O(n^2) sorted array
	constructor(sort_cmp){
		this.array =  []
		this.cmp = sort_cmp
	}

	findIndex(obj){
		for (let i = 0; i < this.array.length; i++){
			if (this.cmp(obj, this.array[i])){
				// this.array[i] is the first element s.t. obj < this.array[i]
				// so insert before i
				return i
			}	
		}
		return this.array.length
	}

	// note: array.splice(idx, cnt, obj)
	// idx: index to insert
	// cnt: number of elements to remove
	// obj: object to insert
	push(obj){
		if (this.array.length == 0){
			this.array.push(obj)
		} else {
			this.array.splice(this.findIndex(obj), 0, obj)
		}
	}
	
	remove(key, cmp = (a, b) => {return a == b}){
		for (let i = 0; i < this.array.length; i++){
			if (cmp(this.array[i], key)){ // TODO is this equality safe?
				this.array.splice(i, 1)
			}
		}
	}

	pop(idx = -1){
		if (idx < 0){
			this.array.splice(this.array.length - idx, 1)
		} else {
			this.array.splice(idx, 1)
		}
	}

	lower_bound(obj, cmp = (a, b) => {return a < b}){
		// return smallest idx s.t. array[idx] >= obj, i.e "NOT array[idx] < obj"
		for (let i = 0; i < this.array.length; i++){
			if (!cmp(this.array[i], obj)){
				return i
			}
		}
		return this.array.length
	}
	upper_bound(obj, cmp = (a, b) => {return a > b}){
		// return smallest idx s.t. array[idx] > obj
		for (let i = 0; i < this.array.length; i++){
			if (cmp(obj, this.array[i])){
				return i
			}
		}
		return this.array.length
	}
	slice(min, max){
		return this.array.slice(min, max)
	}
}

function extract_element(array, cmp){
	let elem = array[0]
	for (let i = 1; i < array.length; i++){
		if (cmp(array[i], elem)){
			elem = array[i]
		}
	}
	return elem
}
function min_element(array, attr){
	return extract_element(array, (a, b) => {return a[attr] < b[attr]})
}

function max_element(array, attr){
	return extract_element(array, (a, b) => {return a[attr] > b[attr]})
}

function FIFO(process_table){
	const sorted_table = process_table.slice().sort((a, b) => (a.arrival_time > b.arrival_time) ? 1 : -1)
	// calculate start times and end times
    let first_free = 0
    for (let i = 0; i < sorted_table.length; i++){
        let p = sorted_table[i]
        p.start_time = Math.max(first_free, p.arrival_time)
        p.end_time = p.start_time + p.duration
        first_free = p.end_time
    }
    return sorted_table
}

/*
	* Shortest Job First (SJF)
	* 	Complexity: O(n^2)
	* 	No preemption
	*	We will sort by the arrival time and run according to the best duration available 
	*/
function SJF(process_table){
	let curr_time = 0
	const sorted_by_arrival = new SortedProcessArray((a, b) => {return a.arrival_time < b.arrival_time})
	const sjf_table = []
	for (let i = 0; i < process_table.length; i++){
		sorted_by_arrival.push(process_table[i])
	}

	while (sorted_by_arrival.array.length > 0){
		// find idx of first process that arrives (strictly) after curr_time
		const idx = sorted_by_arrival.upper_bound(curr_time, (a, b) => {return a < b.arrival_time})
		if (idx == 0){
			// wait for a process to arrive
			curr_time = sorted_by_arrival.array[0].arrival_time
			continue
		}
		// find next process from process pool (slice)
		const next_process = min_element(sorted_by_arrival.slice(0, idx), "duration")
		next_process.start_time = curr_time
        next_process.end_time = curr_time + next_process.duration
        curr_time += next_process.duration
        sjf_table.push(next_process)
		sorted_by_arrival.remove(next_process, (a, b) => {return a["pid"] == b["pid"]})
		// wait for process execution
	}
	return sjf_table
}

/*
	* Earliest Deadline First (EDF)
	* 	Complexity: O(n^2)
	* 	No preemption
	* 	We will update each deadline by its arrival time to get the absolute deadline
	*	We will sort by the absolute deadline and run according to arrival time
	*/
function _non_preemptive_EDF(process_table){
	const sorted_by_arrival = new SortedProcessArray((a, b) => {
		return a.arrival_time < b.arrival_time
	})
	for (let i = 0; i < process_table.length; i++){
		sorted_by_arrival.push(process_table[i])
		sorted_by_arrival.array[i].deadline += process_table[i].arrival_time
	}

	const edf_table = []
	let curr_time = 0
	while (edf_table.length < process_table.length){
		const idx = sorted_by_arrival.upper_bound(curr_time, (a, b) => {return a < b.arrival_time})
		if (idx == 0){
			// wait for a process to arrive
			curr_time = sorted_by_arrival.array[0].arrival_time
			continue
		}
		// find next process from process pool (slice)
		const next_process = min_element(sorted_by_arrival.slice(0, idx), "deadline")
		// wait for process execution
        next_process.start_time = curr_time
        next_process.end_time = curr_time + next_process.duration
		curr_time = next_process.end_time

		edf_table.push(next_process)
		sorted_by_arrival.remove(next_process)
	}
	// fix deadlines from absolute to relative format
	for (let i = 0; i < edf_table.length; i++){
		edf_table[i].deadline -= edf_table[i].arrival_time
	}
	return edf_table
}

function EDF(process_table, quantum, switch_cost){
	const edf_table = []
	let curr_time = 0

	// sort by arrival_time
	const sorted_by_arrival = process_table.slice().sort((a, b) => (a.arrival_time > b.arrival_time) ? 1 : -1)
	// create queue of processes
	const process_queue = new SortedProcessArray((a, b) => {
		return a[1].arrival_time + a[1].deadline < b[1].arrival_time + b[1].deadline
	}) // queue of pairs (remaining duration, process)
	const not_arrived = new Denque()
	for (let i = 0; i < sorted_by_arrival.length; i++){
		not_arrived.push(sorted_by_arrival[i]);
	}

	while (not_arrived.length > 0 || process_queue.array.length > 0){
		if (process_queue.array.length == 0){
			// grab first process that has not yet arrived
			let new_process = not_arrived.shift()
			curr_time = new_process.arrival_time
			process_queue.push([new_process.duration, new_process])
			continue
		}
		let [remaining_duration, process] = process_queue.array[0] // first in, first out
		process_queue.pop(0)
		const delta_time = Math.min(remaining_duration, quantum)
		edf_table.push({
			"pid": process.pid,
			"start_time": curr_time,
			"end_time": curr_time + delta_time,
			"duration": delta_time,
			"priority": process.priority,
			"deadline": process.deadline
		})
		// Run process
		curr_time += delta_time
		remaining_duration -= delta_time
		// process all new processes that arrived in the mean time
		while (not_arrived.length > 0 && not_arrived.peekFront().arrival_time <= curr_time){
			const new_process = not_arrived.shift()
			process_queue.push([new_process.duration, new_process])
		}
		if (remaining_duration > 0){
			// put back on queue
			process_queue.push([remaining_duration, process])
			edf_table.push({
				"pid": "Chaveamento", 
				"start_time": curr_time,
				"end_time": curr_time + switch_cost,
				"duration": switch_cost,
				"priority": -1,
				"deadline": -1
			})
			// run switch
			curr_time += switch_cost
		}
		// put all processes that arrived in the switch interval
		while (not_arrived.length > 0 && not_arrived.peekFront().arrival_time <= curr_time){
			const new_process = not_arrived.shift()
			process_queue.push([new_process.duration, new_process])
		}
	}
	return edf_table
}

/**
	* RoundRobin
	* Complexity: probably something like O(n^2 + (sum of all durations) / q) = O(n^2 + n * max duration / q)
	* 	since each process executes at most ceil(duration) / q times
	* 	and queue operations are O(1)
	* 	and processing the sorted_by_arrival array is O(n^2) because of remove operations
	* Uses npm package denque
*/
function RoundRobin(process_table, quantum, switch_cost){
	const rr_table = []
	let curr_time = 0

	// sort by arrival_time
	const sorted_by_arrival = process_table.slice().sort((a, b) => (a.arrival_time > b.arrival_time) ? 1 : -1)
	// create queue of processes
	const process_queue = new Denque() // queue of pairs (remaining duration, process)
	const not_arrived = new Denque()
	for (let i = 0; i < sorted_by_arrival.length; i++){
		not_arrived.push(sorted_by_arrival[i]);
	}

	while (not_arrived.length > 0 || process_queue.length > 0){
		if (process_queue.length == 0){
			// grab first process that has not yet arrived
			let new_process = not_arrived.shift()
			curr_time = new_process.arrival_time
			process_queue.push([new_process.duration, new_process])
			continue
		}
		console.log("curr_time: " + curr_time)
		let [remaining_duration, process] = process_queue.shift() // first in, first out
		const delta_time = Math.min(remaining_duration, quantum)
		rr_table.push({
			"pid": process.pid,
			"start_time": curr_time,
			"end_time": curr_time + delta_time,
			"duration": delta_time,
			"priority": process.priority,
			"deadline": process.deadline
		})
		// Run process
		curr_time += delta_time
		remaining_duration -= delta_time
		// process all new processes that arrived in the mean time
		while (not_arrived.length > 0 && not_arrived.peekFront().arrival_time <= curr_time){
			const new_process = not_arrived.shift()
			process_queue.push([new_process.duration, new_process])
		}
		if (remaining_duration > 0){
			// put back on queue
			process_queue.push([remaining_duration, process])
			rr_table.push({
				"pid": "Chaveamento", 
				"start_time": curr_time,
				"end_time": curr_time + switch_cost,
				"duration": switch_cost,
				"priority": -1,
				"deadline": -1
			})
			// run switch
			curr_time += switch_cost
		}
		// put all processes that arrived in the switch interval
		while (not_arrived.length > 0 && not_arrived.peekFront().arrival_time <= curr_time){
			const new_process = not_arrived.shift()
			process_queue.push([new_process.duration, new_process])
		}
	}
	return rr_table
}

// export default {AddProcess, FIFO, SJF}
export {AddProcess, FIFO, SJF, EDF, RoundRobin}

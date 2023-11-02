function AddProcess(process_table, pid, arrival_time, duration, priority, deadline){
	process_table.push({
		"pid": pid,
		"arrival_time": arrival_time,
		"duration": duration,
		"priority": priority,
		"deadline": deadline
	})
}

class SortedArray{
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
	
	remove(key){
		for (let i = 0; i < this.array.length; i++){
			if (this.array[i] == key){ // TODO is this equality safe?
				this.array.splice(i, 1)
			}
		}
	}

	pop(){
		this.array.pop()
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
	return sorted_table
}

function SJF(process_table){
	let curr_time = 0
	const sorted_by_arrival = new SortedArray((a, b) => {return a.arrival_time < b.arrival_time})
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
		sjf_table.push(next_process)
		sorted_by_arrival.remove(next_process)
		// wait for process execution
		curr_time = next_process.arrival_time + next_process.duration
	}
	return sjf_table
}

// export default {AddProcess, FIFO, SJF}
export {AddProcess, FIFO, SJF}

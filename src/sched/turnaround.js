export function calculateTurnaround(processTable, schedData){
		let turnarounds = new Map();
		// init keys
		processTable.forEach((process) => {
			turnarounds.set(process.pid, {
				"min_time": process.arrival_time,
				"max_time": process.arrival_time
			});
		})
		// calculate max end time for each process
		schedData.forEach((process) => {
			if (process.pid != "Chaveamento"){
				const min_time = turnarounds.get(process.pid).min_time;
				turnarounds.set(
					process.pid,
					{
						"min_time": min_time,
						"max_time": process.end_time
					}
				);
			}
		})
		let final_turnaround = 0.0
		for (const [_, process_info] of turnarounds){
			final_turnaround += (process_info.max_time - process_info.min_time) / processTable.length
		}
		return final_turnaround;
}

import Denque from 'denque';

// processTable.pages is a list of pageNumbers, with each number n
// satisfying 0 <= n < MEMORY_SIZE

// pageTable is an array of objects {page: pageNumber, pid: owner_pid}
//
// each element of pageTableHistory: [pageFault?, pageTableCurr]

function findPage(pageTable, pageNum){
	for (let i = 0; i < pageTable.length; i++){
		const page = pageTable[i]["page"];
		if (page == pageNum) return i;
	}
	return -1
}

function argMin(arr){
	let currMin = arr[0], currArgMin = 0;
	for (let i = 1; i < arr.length; i++){
		if (arr[i] < currMin){
			currMin = arr[i];
			currArgMin = i;
		}
	}
	return currArgMin
}

// LRU-1 algorithm
// Removes page with last access time furthest in the past
export function LRU(pageTable, processTable){
	const pageTableHistory = [];
	pageTableHistory.push([false, [...pageTable]]);
	const accessHistory = Array(pageTable.length).fill(-1);

	processTable.forEach((process, iter_idx) => {
		let pageFault = false;

		// free pages are just pages that were acessed in time -1 (ie before time 0)
		// so there is no need to handle them separately
		for (let i = 0; i < process.pages.length; i++){
			const find_idx = findPage(pageTable, process.pages[i])
			if (find_idx != -1){
				accessHistory[find_idx] = iter_idx;
			} else {
				const replace_idx = argMin(accessHistory)
				pageTable[replace_idx] = {"page": process.pages[i], "pid": process.pid} 
				accessHistory[replace_idx] = iter_idx
				pageFault = true;
			}
		}
		pageTableHistory.push([pageFault, [...pageTable]])
	})
	return pageTableHistory
}

export default LRU;

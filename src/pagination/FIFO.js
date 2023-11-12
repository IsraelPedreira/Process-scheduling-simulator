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

export function FIFO(pageTable, processTable){
	const pageQueue	= new Denque();

	const pageTableHistory = []
	// NOTE : so that it aligns with the chart, since it needs an extra entry for labels
	pageTableHistory.push([false, [...pageTable]])
	processTable.forEach((process) => {
		let isPageFault = false;
		if (process.pid == "Chaveamento") {
			// state stays the same
			pageTableHistory.push([false, [...pageTable]])
			return;
		}
		// occupy all free pages
		let free = pageTable.filter((entry) => entry["page"] == "x").length; 
		// there are free pages and not all needed pages are loaded
		for (let i = 0; i < process.pages.length && free > 0; i++){
			const find_idx = findPage(pageTable, process.pages[i]);
			if (find_idx != -1){
				// page is already loaded
				continue;
			} else {
				isPageFault = true;
				const replace_idx = pageTable.findIndex((entry) => entry["page"] == "x");
				// update
				pageTable[replace_idx] = {"page": process.pages[i], "pid": process.pid};
				// push to queue
				pageQueue.push(process.pages[i]);
				--free
			}
		}

		// replace pages as needed
		for (let i = 0; i < process.pages.length; i++){
			const find_idx = findPage(pageTable, process.pages[i]);
			if (find_idx != -1){
				// page is already loaded
				continue;
			} else {
				isPageFault = true;
				const replace_idx = findPage(pageTable, pageQueue.shift());
				// update
				pageTable[replace_idx] = {"page": process.pages[i], "pid": process.pid};
				// push to queue
				pageQueue.push(process.pages[i]);
			}
		}
		pageTableHistory.push([isPageFault, [...pageTable]]);
	})
	return pageTableHistory;
}

export default FIFO

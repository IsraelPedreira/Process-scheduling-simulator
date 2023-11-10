import Denque from 'denque';

export function FIFO(pageTable, setPageTable, processTable, asState=false){
	const pageQueue	= new Denque();

	const pageTableHistory = []
	processTable.forEach((process) => {
		let pageFault = false;
		if (process.pid == "Chaveamento") {
			pageTableHistory.push([false, [...pageTable]])
			return;
		}
		const needed = process.numPages;

		// occupy all free pages
		const free = pageTable.filter((pid) => pid == "x").length; 
		const loaded_first = pageTable.filter((pid) => pid == process.pid).length;
		// there are free pages and not all needed pages are loaded
		if (free > 0 && loaded_first < needed){
			for (let i = 0; i < Math.min(needed - loaded_first, free); i++){
				const idx = pageTable.findIndex((pid) => pid == "x");	
				const _pageTable = [...pageTable];
				_pageTable[idx] = process.pid;
				pageQueue.push(idx);
				if (asState) {
					setPageTable(_pageTable);
				} else {
					pageTable = setPageTable(_pageTable);
				}
			}
		}
		// check if, after grabbing free pages, all needed pages are loaded
		const loaded_second = pageTable.filter((pid) => pid == process.pid).length;
		// there are still pages to be loaded, and there are no free pages
		if (needed > loaded_second) {
			// do FIFO
			for (let i = 0; i < needed - loaded_second; i++){
				const idx = pageQueue.shift();
				const _pageTable = [...pageTable];
				_pageTable[idx] = process.pid;
				pageQueue.push(idx);
				if (asState) {
					setPageTable(_pageTable);
				} else {
					pageTable = setPageTable(_pageTable);
				}
			}
			pageFault = true;
		}
		pageTableHistory.push([pageFault, [...pageTable]])
	})
	return pageTableHistory;
}

export default FIFO

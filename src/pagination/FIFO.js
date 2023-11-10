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
		if (free > 0){
			for (let i = 0; i < Math.min(needed, free); i++){
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
		// check if all needed pages are loaded
		const loaded = pageTable.filter((pid) => pid == process.pid).length;
		if (needed > loaded) {
			// do FIFO
			for (let i = 0; i < needed - loaded; i++){
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

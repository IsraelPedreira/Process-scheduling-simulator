import React from 'react';
import ReactDOM from 'react-dom/client'
import '../styles/entry.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// pageTable : [{"page": num, "pid": num}, ...]

export function MemTable({ pageTable, currProcessPages }) {
  function noCountX(array) {
    let count = 0;
    for (const elem of array) {
				const page = elem.page;
        if (page !== 'x') {
            count++;
        }
    }
    return count;
  }
  const percentage = Number((noCountX(pageTable)/pageTable.length)*100).toFixed(2)
	const pageNumbers = pageTable.map((page) => page.page);
	const extract_color = (page) => {
		if (currProcessPages.includes(page)) {
			return "ram-cell-active";
		} else {
			return "ram-cell-inactive";
		}
	}

  return (
	<div className="ram-bg">
    <div>
      <div className="ram-title">
        Memória RAM
      </div>
      <ul className="ram-list">
        {
          pageNumbers.map((page, index) => (
            <li className={extract_color(page)} key={index}>{page}</li>
          ))
        }
      </ul>
    </div>
		<div style={{ width: 100, height: 100 }}>
			<CircularProgressbar value={percentage} text={`${percentage}%`} />
		</div>
	</div>
  )
}

export default MemTable;

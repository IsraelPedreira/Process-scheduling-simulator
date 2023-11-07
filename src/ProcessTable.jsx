import { useState } from 'react';

export const ProcessTable = () => {
  const [processTable, setProcessTable] = useState([]);

  const updateProcessTable = (newTable) => {
    setProcessTable(newTable);
  };

  return { processTable, updateProcessTable };
};

export default ProcessTable;

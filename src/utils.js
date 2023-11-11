export default function Convert(data) {
  let converted_data = [
    [
      { type: "string", id: "Row" },
      { type: "string", id: "PID" },
      { type: "number", id: "Start" },
      { type: "number", id: "End" }
    ]
  ];
  let last_process_name = "";
  let pids_setted = []

  /*
  // ARMENGUE: colocando todos os processos no chart
  data.forEach((objeto) => {
    let name = `P${objeto.pid}`;

    if (!pids_setted.includes(objeto.pid) && objeto.pid !== "Chaveamento") {
      converted_data.push([name, "process_position_marker", new Date(0, 0, 0, 0, 0, 0, 0 ), new Date(0, 0, 0, 0, 0, 0, 0 )]);
      pids_setted.push(objeto.pid);
    }
    
  });

  // ARMENGUE 2: colocando a timeline no tamanho certo
  const end_time = data[data.length - 1].end_time;
  let name = `P${data[data.length - 1].pid}`;
  converted_data.push([name, "process_position_marker", new Date(0, 0, 0, 0, 0, end_time, 0 ), new Date(0, 0, 0, 0, 0, end_time, 0 )]);
  */

  data.forEach((objeto) => {
    let name = `P${objeto.pid}`;
    let start = objeto.start_time;
    let end = objeto.end_time;

    if (objeto.priority === -1) {
      converted_data.push([last_process_name, "Chaveamento", new Date(0, 0, 0, 0, 0, start, 0 ), new Date(0, 0, 0, 0, 0, end, 0 )]);
      last_process_name = "";
    } else {
      converted_data.push([name, name, new Date(0, 0, 0, 0, 0, start, 0 ), new Date(0, 0, 0, 0, 0, end, 0 )]);
      last_process_name = name;
    }
    
  });
  console.log(converted_data);
  return converted_data;
}
  

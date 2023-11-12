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
  let dead_line_marker_setted = []
  let pids_setted = []

  // Configurando a cor do deadline
  let name_for_deadline_color = `P${data[0].pid}`;
  converted_data.push([name_for_deadline_color, "process_position_dead_line_marker", new Date(0, 0, 0, 0, 0, 0, 0 ), new Date(0, 0, 0, 0, 0, 0, 0 )]);
  
  // colocando todos os processos no chart
  data.forEach((objeto) => {
    let name = `P${objeto.pid}`;

    if (!pids_setted.includes(objeto.pid) && objeto.pid !== "Chaveamento") {
      converted_data.push([name, "process_position_marker", new Date(0, 0, 0, 0, 0, 0, 0 ), new Date(0, 0, 0, 0, 0, 0, 0 )]);
      pids_setted.push(objeto.pid);
    }
    
  });
  
  //  colocando a timeline no tamanho certo
  const end_time = data[data.length - 1].end_time;
  let name_for_time_width = `P${data[data.length - 1].pid}`;
  converted_data.push([name_for_time_width, "process_position_marker", new Date(0, 0, 0, 0, 0, end_time, 0 ), new Date(0, 0, 0, 0, 0, end_time, 0 )]);

  // Posiconando os DeadLines
  data.forEach((objeto) => {
    if ('arrival_time_dead_line' in objeto && objeto.pid !== "Chaveamento") {
      let name = `P${objeto.pid}`;

      if(!dead_line_marker_setted.includes(objeto.pid)) {

        let dead_line_position = objeto.arrival_time_dead_line + objeto.deadline;
        converted_data.push([name, "process_position_dead_line_marker", new Date(0, 0, 0, 0, 0, dead_line_position, 0 ), new Date(0, 0, 0, 0, 0, dead_line_position, 0 )]);
        dead_line_marker_setted.push(objeto.pid);
      }
    } 
  });

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
  console.log(converted_data)
  return converted_data;
  
}
  

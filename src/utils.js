export default function Convert(data) {
    let converted_data = [
      [
        { type: "string", id: "Process" },
        { type: "string", id: "bar label" },
        { type: "string", role: "tooltip" },
        { type: "number", id: "Start" },
        { type: "number", id: "End" }
      ]
    ];
    const end_time = data[data.length - 1].end_time;
  
    // ARMENGUE: colocando a timeline no tamanho certo
    converted_data.push([`P${data[0].pid}`, null, null, end_time, end_time]);
  
    data.forEach((objeto) => {
      let name = `P${objeto.pid}`;
      let start = objeto.start_time;
      let end = objeto.end_time;
      converted_data.push([name, null, null, start, end]);
    });
    return converted_data;
  }
  
export default function RR(data) {
    const infos = data[0];
    const preemption = infos.preemption;
    const quantum = infos.quantum;
    let processedData = [];
    let sortedData = data.slice(1);
    let first_free_start_time = 0;
  
    while (true) {
      // Ordenada os processos por tempo de chegada
      sortedData.sort((a, b) => a.arrival_time - b.arrival_time);
      let completed_time = 0;
  
      if (sortedData.length === 0) {
        break;
      }
  
      // sortedData[0] e o processo que esta em primeiro na fila de espera
      if (sortedData[0].duration >= quantum) {
        sortedData[0].duration -= quantum;
        completed_time = quantum;
      } else {
        completed_time = sortedData[0].duration;
        sortedData[0].duration = 0;
      }
  
      // Cria uma copia do processo atual pra agregar informacoes necessarias para o array de retorno da funcao
      let newProcessToManipulate = { ...sortedData[0] };
  
      // Calula o tempo de inicio do processo e o proximo tempo livre
      if (first_free_start_time < newProcessToManipulate.arrival_time) {
        newProcessToManipulate.start_time = newProcessToManipulate.arrival_time;
        first_free_start_time =
          newProcessToManipulate.arrival_time + completed_time;
      } else {
        newProcessToManipulate.start_time = first_free_start_time;
        first_free_start_time = first_free_start_time + completed_time;
      }
  
      // calcula o tempo em que o processo atual vai parar de ser processado
      newProcessToManipulate.end_time =
        newProcessToManipulate.start_time + completed_time;
  
      // Cria o "processo" de preempcao
      let preemptionProcess = { ...newProcessToManipulate };
      preemptionProcess.pid = "Chaveamento";
      preemptionProcess.start_time = newProcessToManipulate.end_time;
      preemptionProcess.duration = preemption;
      preemptionProcess.end_time =
        preemptionProcess.start_time + preemptionProcess.duration;
  
      // Adiciona o processo no array de retorno da funcao
      processedData.push(newProcessToManipulate);
  
      // Remove e adiciona novamente o processo atual com novo arrival_time;
      if (sortedData[0].duration === 0) {
        sortedData.shift();
      } else {
        let currentProcess = { ...sortedData[0] };
        currentProcess.arrival_time = newProcessToManipulate.end_time;
        sortedData.shift();
        sortedData.push(currentProcess);
  
        if (sortedData.length !== 0) {
          processedData.push(preemptionProcess);
          first_free_start_time += preemption;
        }
      }
    }
    return processedData;
  }
  

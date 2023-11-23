# Trabalho Final de Sistemas Operacionais
Imagem da tela principal:
![image](https://github.com/IsraelPedreira/trabalho-so/assets/49205879/52a82074-571f-48e9-9104-22cf66c9674b)



# Vite - Guia de Uso

Antes de começar, certifique-se de ter o [Node.js](https://nodejs.org/) instalado em seu sistema.

## Uso

### 1 - Instalar as dependências 
Execute o comando
```bash
npm i
```
### 2 - Executar o servidord 
Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
```

Isso iniciará um servidor de desenvolvimento em `http://localhost:5173` por padrão. Abra este URL em seu navegador para visualizar sua aplicação em tempo real durante o desenvolvimento.

### 3 - Suporte a submissão via arquivo JSON

Essa plataforma também suporta a submissão de dados de processo e escalonamento/paginação através de um arquivo JSON em formato específico - substituindo o método padrão de entradas de dados pela GUI.

O formato pode ser exemplificado pelo seguinte arquivo válido de configuração:

```json
{
  "process_table": [
    {
      "pid": 0,
      "arrival_time": 7,
      "duration": 9,
      "priority": 2,
      "deadline": 12,
      "pages": [
        9,
        123,
        133,
        94,
        131,
        68,
        17,
        84,
        62,
        82,
        77,
        31,
        56
      ]
    },
    {
      "pid": 1,
      "arrival_time": 8,
      "duration": 1,
      "priority": 5,
      "deadline": 6,
      "pages": [
        57,
        101,
        124,
        134,
        47,
        89,
        113,
        24
      ]
    },
    {
      "pid": 2,
      "arrival_time": 25,
      "duration": 9,
      "priority": 0,
      "deadline": 14,
      "pages": [
        8,
        38,
        91,
        18,
        114,
        23,
        141,
        109,
        37,
        68,
        116,
        34,
        11
      ]
    },
    {
      "pid": 3,
      "arrival_time": 9,
      "duration": 3,
      "priority": 3,
      "deadline": 1,
      "pages": [
        124,
        104,
        10,
        68,
        120,
        5,
        64,
        25,
        60
      ]
    },
    {
      "pid": 4,
      "arrival_time": 5,
      "duration": 9,
      "priority": 4,
      "deadline": 7,
      "pages": [
        114,
        104,
        132,
        24,
        76,
        31,
        121,
        12,
        6,
        106,
        130
      ]
    },
    {
      "pid": 5,
      "arrival_time": 14,
      "duration": 7,
      "priority": 5,
      "deadline": 15,
      "pages": [
        56,
        142,
        10,
        28,
        66,
        102,
        15,
        115,
        110,
        65,
        103,
        94,
        73,
        139,
        140,
        39,
        80,
        71,
        35
      ]
    },
    {
      "pid": 6,
      "arrival_time": 18,
      "duration": 7,
      "priority": 1,
      "deadline": 11,
      "pages": [
        134,
        97,
        108,
        31,
        39,
        120,
        119,
        147,
        145,
        118,
        30,
        99,
        80,
        22
      ]
    },
    {
      "pid": 7,
      "arrival_time": 28,
      "duration": 6,
      "priority": 3,
      "deadline": 16,
      "pages": [
        3,
        34,
        5,
        94,
        82,
        97,
        121,
        132,
        55
      ]
    },
    {
      "pid": 8,
      "arrival_time": 0,
      "duration": 1,
      "priority": 0,
      "deadline": 9,
      "pages": [
        64,
        112,
        119,
        31,
        58,
        40,
        88,
        37,
        48,
        62,
        39,
        41,
        76,
        77,
        74,
        27,
        99,
        3,
        24
      ]
    },
    {
      "pid": 9,
      "arrival_time": 16,
      "duration": 2,
      "priority": 1,
      "deadline": 15,
      "pages": [
        62,
        13
      ]
    },
    {
      "pid": 10,
      "arrival_time": 17,
      "duration": 1,
      "priority": 4,
      "deadline": 7,
      "pages": [
        84,
        86,
        74
      ]
    },
    {
      "pid": 11,
      "arrival_time": 12,
      "duration": 10,
      "priority": 4,
      "deadline": 11,
      "pages": [
        53,
        10,
        110,
        64,
        12,
        123,
        86,
        0,
        27
      ]
    }
  ],
  "quantum": 3,
  "switch_cost": 2,
  "sched_mode": "SJF",
  "mem_mode": "FIFO"
}
```

const readlineSync = require('readline-sync');

const WebSocket = require('ws');

// Conecta ao servidor WebSocket
const port = 8080;

const ws = new WebSocket(`ws://localhost:${port}`);

// Recebe a resposta do servidor
ws.on('open', async function open() {
  console.log('Conectado ao servidor WebSocket.');

  const user = readlineSync.question('Favor informar o usuário: ');
  const password = readlineSync.question('Favor informar a senha: ');

  ws.send(JSON.stringify({
    method: 'authenticate',
    params: [user, password]  // Parâmetros da chamada RPC
  }));
});

ws.on('message', function incoming(data) {
  const response = JSON.parse(data);
  console.log('Resposta do servidor:', response);
});

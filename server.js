const WebSocket = require('ws');
const config = require('config');

// Criação do servidor WebSocket na porta 3050

const port = config.port;

const wss = new WebSocket.Server({ port: port });

console.log(`Servidor WebSocket rodando na porta ${port}`);

// Simula um "serviço RPC" com métodos
const rpcMethods = {
  authenticate: (username, password) => {
    if (username === 'usuario1' && password === 'senha1') {
      return 'Autenticação bem-sucedida';
    }
    return 'Usuário ou senha incorretos';
  },
  getUserData: (username) => {
    if (username === 'usuario1') {
      return { username: 'usuario1', role: 'admin' };
    }
    return { error: 'Usuário não encontrado' };
  }
};

// Quando um cliente se conecta
wss.on('connection', (ws) => {
  console.log('Novo cliente conectado.');

  // Quando o servidor recebe uma mensagem (que pode ser uma chamada RPC)
  ws.on('message', (message) => {
    try {
      const { method, params } = JSON.parse(message);  // Espera-se um formato JSON com método e parâmetros

      // Verifica se o método existe e chama o serviço adequado
      if (!rpcMethods[method]) {
        ws.send(JSON.stringify({ error: 'Método não encontrado' }));
      }

      const result = rpcMethods[method](...params);  // Chama o método com os parâmetros
      ws.send(JSON.stringify({ result }));  // Envia o resultado de volta para o cliente

    } catch (error) {
      ws.send(JSON.stringify({ error: 'Erro ao processar a mensagem' }));
    }
  });

  // Quando a conexão for fechada
  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });
});

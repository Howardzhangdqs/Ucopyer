const Ws = require('ws').WebSocketServer;

var wss;

var init = (app) => {
	wss = new Ws({ server });
	wss.on('connection', (ws) => {
		ws.on('message', (data) => {
			console.log('received: %s', data);
		});
		ws.on('close', (data) => {
			console.log('closed');
		});

		boardcast({
			log: "有新用户登录"
		})
	});
};

var boardcast = (str) => {
	if (typeof str == 'object')
		str = JSON.stringify(str);

	wss.clients.forEach((ws) => {
		ws.send(str);
	});
};

module.exports = {
	init, boardcast
};
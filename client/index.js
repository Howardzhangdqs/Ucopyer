const fs = require('fs');
const os = require('os');
const cmd = require('node-cmd');
const http = require('http');
const path = require('path');
const chalk = require('chalk');
const express = require('express');

const bodyParser = require('body-parser');

const Gzip = require("./Gzip.js")

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/dashboard', express.static('./dashboard'));

app.use("/dev", require("./router/dev.js"));

const FILES = {
	filelib: "./filelib",//path.resolve(__dirname, "./filelib"),
	md5file: "./filelib/.md5",//path.resolve(__dirname, "./filelib/.md5"),
};

const PORT = 65432;

var format_date = function (t) {
	t = t || new Date();
	return (t.getFullYear() + '-' +
           ('0' + (t.getMonth() + 1)).slice(-2) + '-' +
           ('0' + t.getDate()).slice(-2) + ' ' +
           ('0' + t.getHours()).slice(-2) + ':' +
           ('0' + t.getMinutes()).slice(-2) + ':' +
           ('0' + t.getSeconds()).slice(-2) + '.' +
           ('000' + t.getMilliseconds()).slice(-4));
};

app.get("/", (req, res) => {
	res.send(`<script>window.location.href="/dashboard/"</script>`);
	console.log('[' + format_date() + ']' + " " +
		req.socket.remoteAddress.split(":").pop() + " \"" +
		chalk.cyan(req.method + " " + decodeURI(req.url)) + '" "' +
		req.headers["user-agent"] + '"');
});

// Gzip.decode.file("./shit.tmp")

app.post("/Ucopyer/copy", (req, res) => {
	console.log(JSON.parse(req.body.data));
	res.send(JSON.stringify({
		status: 200
	}));

	try { fs.accessSync(FILES.filelib) }
	catch { fs.mkdirSync(FILES.filelib) }

	try { fs.accessSync(FILES.md5file) }
	catch { Gzip.encode.file(FILES.md5file, "{}") }

	let filelib = JSON.parse(Gzip.decode.file(FILES.md5file));

	fileinfo = JSON.parse(req.body.data);
	filecopy = {};

	for (let i in fileinfo) {
		if (! filelib[i]) filecopy[i] = fileinfo[i];
		filelib[i] = { p: fileinfo[i], t: + new Date() };
	}
	console.log( JSON.stringify(filelib));
	Gzip.encode.file(FILES.md5file, JSON.stringify(filelib));
	for (let i in filecopy) {
		fs.copyFileSync(filecopy[i], path.resolve(FILES.filelib, i));
		console.log(`${filecopy[i]} -> ${path.resolve(FILES.filelib, i)}`);
	}

});

http_server = http.createServer(app);

const ws = require("./router/ws.js").init(http_server);

http_server.listen(PORT, () => {
	console.log(chalk.yellow('Starting up server'));
	console.log(chalk.yellow('正在开启服务器'));
	console.log();
	
	var getIPAddress = () => {
		let ipv4 = [], ifaces = os.networkInterfaces();
		for (let dev in ifaces)
			ifaces[dev].forEach((details, alias) => {
				if (details.family == 'IPv4') ipv4.push(details.address);
			});
		return ipv4;
	};

	console.log(chalk.yellow("Server Available on  服务器在以下地址可用:"));
	let ip = getIPAddress();
	for (let i in ip) console.log(`  http://${ip[i]}:\x1B[38;2;19;161;14m${PORT}\x1B[39m`);
	
	console.log("\nHit Ctrl-C to stop the server  按下 Ctrl-C 关闭服务器\n");
});


process.on('SIGINT', () => {
    console.log(chalk.red("Server stopped, ALL child_process killed meanwhile"));
    console.log(chalk.red("服务器已关闭，同时关闭所有子进程"));
	process.exit();
});
/*
setInterval(function () {
	console.log("Main process: calling python");
	cmd.runSync('fetch');
}, 1000 * 60);
*/
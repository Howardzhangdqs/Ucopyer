const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');

const Gzip = require("./assets/Gzip.js")

const express = require('express');
var app = express();
const wss = require('express-ws')(app);

const bodyParser = require('body-parser');

// 加载bodyParser参数解析
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// 静态dashboard控制面板
app.use('/dashboard', express.static('./dashboard'));

// dev窗口
app.use("/dev", require("./assets/router/dev.js"));

// 路径定义
const FILES = {
	filelib: "./filelib",//path.resolve(__dirname, "./filelib"),
	md5file: "./filelib/.md5",//path.resolve(__dirname, "./filelib/.md5"),
};

// 端口
const PORT = 65432;

/** format_date
 * 格式化时间戳
 * @param {Number} t 时间戳
 * @returns 一个格式化后的字符串
 */
var format_date = (t) => {
	t = t || new Date();
	return (t.getFullYear() + '-' +
		('0' + (t.getMonth() + 1)).slice(-2) + '-' +
		('0' + t.getDate()).slice(-2) + ' ' +
		('0' + t.getHours()).slice(-2) + ':' +
		('0' + t.getMinutes()).slice(-2) + ':' +
		('0' + t.getSeconds()).slice(-2) + '.' +
		('000' + t.getMilliseconds()).slice(-4));
};

// 跳转
app.get("/", (req, res) => {
	res.send(`<script>window.location.href="/dashboard/"</script>`);
	console.log('[' + format_date() + ']' + " " +
		req.socket.remoteAddress.split(":").pop() + " \"" +
		chalk.cyan(req.method + " " + decodeURI(req.url)) + '" "' +
		req.headers["user-agent"] + '"');
});

// 需要复制的文件
app.post("/Ucopyer/copy", (req, res) => {
	console.log(req.body);
	res.send(JSON.stringify({
		status: 200
	}));

	try { fs.accessSync(FILES.filelib) }
	catch { fs.mkdirSync(FILES.filelib) }

	try { fs.accessSync(FILES.md5file) }
	catch { Gzip.encode.file(FILES.md5file, "{}") }

	// 读入的原先的文件信息
	let filelib = JSON.parse(Gzip.decode.file(FILES.md5file));

	// 发送来的文件信息
	fileinfo = req.body;
	//需要复制的文件信息
	filecopy = {};

	new_flag = false;

	// 检查相应文件是否需要复制
	for (let i in fileinfo) {
		if (! filelib[i]) {
			// 计入复制
			new_flag = true;
			filecopy[i] = fileinfo[i];
			filelib[i] = {
				p: fileinfo[i],
				t: + new Date()
			};
		}
	}

	console.log(filecopy);

	// 文件信息写入
	Gzip.encode.file(FILES.md5file, JSON.stringify(filelib));
	// 复制
	for (let i in filecopy) {
		fs.copyFileSync(filecopy[i], path.resolve(FILES.filelib, i));
		console.log(`${filecopy[i]} -> ${path.resolve(FILES.filelib, i)}`);
	}

});

//const _ws = require("./assets/router/ws.js").init(http_server);

// 开服务器板子
app.listen(PORT, () => {
	console.log(chalk.yellow('Starting up server'));
	console.log(chalk.yellow('正在开启服务器'));
	console.log();
	
	var getIPAddress = () => {
		let ipv4 = [], ifaces = os.networkInterfaces();
		for (let dev in ifaces)
			ifaces[dev].forEach((details, _alias) => {
				if (details.family == 'IPv4') ipv4.push(details.address);
			});
		return ipv4;
	};

	console.log(chalk.yellow("Server Available on  服务器在以下地址可用:"));
	let ip = getIPAddress();
	for (let i in ip) console.log(`  http://${ip[i]}:${chalk.green(PORT)}`);
	
	console.log("\nHit Ctrl-C to stop the server  按下 Ctrl-C 关闭服务器\n");
});

// 退出板子
process.on('SIGINT', () => {
    console.log(chalk.red("Server stopped, ALL child_process killed meanwhile"));
    console.log(chalk.red("服务器已关闭，同时关闭所有子进程"));
	process.exit();
});
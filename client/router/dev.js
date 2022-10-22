const express = require("express");
const chalk = require('chalk');
var router = express.Router();

router.all("/time", (req, res) => {
	res.send(`${+ new Date()}`);
});

router.all("/ping", (req, res) => {
	res.send(JSON.stringify({
		status: 200
	}));
});

router.post("/log", (req, res) => {
	console.log(req.body);
	res.send(JSON.stringify({
		status: 200
	}));
});

router.all("/shutdown", (req, res) => {
	res.send(JSON.stringify({
		status: 200,
		code: "Good Bye",
	}));
	console.log(chalk.red(`来自 ${chalk.cyan(req.originalUrl)} 的强制关闭`));
    console.log(chalk.red("Server stopped, ALL child_process killed meanwhile"));
    console.log(chalk.red("服务器已关闭，同时关闭所有子进程"));
	process.exit();
});

module.exports = router;
const G = require("./Gzip.js");
const chalk = require("chalk");
const fs = require("fs");
const path = require('path');

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const FILES = {
	filelib: "./filelib",//path.resolve(__dirname, "./filelib"),
	md5file: "./filelib/.md5",//path.resolve(__dirname, "./filelib/.md5"),
};

function question (title) {
	return new Promise((rs, rj) => {
		rl.question(title, data => {
			rs(data);
		})
	})
};

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

var data = JSON.parse(G.decode.file("./filelib/.md5"));
var filelib = fs.readdirSync("./filelib/");
var _flib = [];
var cmds = {};

cmds = {
	"log": () => {
		for (let i in _flib)
			console.log(chalk.green(_flib[i].m),
				format_date(new Date(_flib[i].t)),
				chalk.cyan(_flib[i].n));
	},
	"rn": () => {
		for (let i in _flib) {
			let o = path.resolve(FILES.filelib, _flib[i].m),
				t = path.resolve(FILES.filelib, _flib[i].m + "-" + _flib[i].n);
			console.log(o + " -> " + t);

			fs.rename(o, t, (err) => {
				if (err) {
					console.log(err);
					console.log(chalk.red("Failed") + ": " + o + " -> " + t);
				}
			});
		}
	},
};

cmds["ls"] = cmds["log"];

(async function () {
	for (let i in data)
		if (filelib.indexOf(i) >= 0)
			_flib.push({
				m: i,
				t: data[i].t,
				n: data[i].p.split(/[\\/]/g).pop(),
			});
			

	_flib.sort((a, b) => (b.t - a.t));

	cmds.log();

	let req = await question("\n> ");
	while (req != "") {

		if (cmds[req]) cmds[req]();
		else console.log("< " + chalk.red(`Command \`${chalk.cyan(req)}\` not found`));

		req = await question("> ");
	}
	
	console.log(chalk.red("\nExit"));

	process.exit(0);
})();
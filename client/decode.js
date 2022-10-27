const G = require("./Gzip.js");
const chalk = require("chalk");
const fs = require("fs");

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

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
const cmd = {
	"log": () => {
		for (let i in _flib)
			console.log(chalk.green(_flib[i].m),
				format_date(new Date(_flib[i].t)),
				chalk.cyan(_flib[i].n));
	},
};

(async function () {
	for (let i in data)
		if (filelib.indexOf(i) >= 0)
			_flib.push({
				m: i,
				t: data[i].t,
				n: data[i].p.split(/[\\/]/g).pop(),
			});
			

	_flib.sort((a, b) => (b.t - a.t));

	cmd.log();

	let req = await question("\n> ");
	while (req != "") {

		if (cmd[req]) cmd[req]();
		else console.log("< " + chalk.red(`Command \`${chalk.cyan(req)}\` not found`));

		req = await question("> ");
	}
	
	console.log(chalk.red("\nExit"));

	process.exit(0);
})();
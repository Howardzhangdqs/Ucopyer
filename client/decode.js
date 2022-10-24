const G = require("./Gzip.js");
const chalk = require("chalk");
const fs = require("fs");
data = JSON.parse(G.decode.file("./filelib/.md5"));
okf = fs.readdirSync("./filelib/");

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

(async function () {
	for (let i in data)
		if (okf.indexOf(i) >= 0)
			console.log(chalk.green(i), format_date(new Date(data[i].t)), chalk.cyan(data[i].p.split(/[\\/]/g).pop()));

	await question("");
	process.exit(0);
})();


const cmd = require('node-cmd');

cmd.runSync('ucopyer')

setInterval(function () {
	console.log("Main process: calling python");
	console.log(cmd.runSync('fetch'));
}, 1000 * 60 * 10);
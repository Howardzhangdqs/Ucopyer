const cmd = require('node-cmd');

setInterval(function () {
	console.log("Main process: calling python");
	console.log(cmd.runSync('fetch'));
}, 1000 * 60 * 5);

cmd.run('ucopyer')
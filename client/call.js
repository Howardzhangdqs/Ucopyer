const cmd = require("node-cmd");

//cmd.run("ucopyer");

const fs = require("fs");
const path = require("path");

const dirls = ["Microsoft/Windows/Recent", "Microsoft/Office/Recent"];

for (let i in dirls) {
	let Recentpth = path.join(process.env.APPDATA, dirls[i]);
	fs.watch(Recentpth, (method, dir) => {
		if (method == "change")
			console.log(method, path.join(Recentpth, dir));
	});
}
/*
setInterval(function () {
	console.log("Main process: calling python");
	console.log(cmd.runSync("fetch"));
}, 1000 * 60 * 5);
*/
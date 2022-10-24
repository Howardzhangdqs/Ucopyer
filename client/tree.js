const fs = require("fs");
const path = require("path");

const Tree = (dir) => {
	let dirdata = fs.readdirSync(dir);
	dirdata.forEach((file) => {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			
		}
	});
};

module.exports = Tree;
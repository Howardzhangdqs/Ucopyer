const fs = require("fs");
const path = require("path");

/** tree
 * @param dir Basedir
 * @param filename the filename of the current dir
 */
const tree = (dir, filename) => {
	filename = filename || path.resolve().split("\\").pop();
	let dirdata = fs.readdirSync(dir);
	let ret = {
		t: 0,
		c: [],
		n: filename,
	};
	dirdata.forEach((file) => {
		let subfile = path.join(dir, file);
		if (fs.statSync(subfile).isDirectory()) ret.c.push(tree(subfile, file));
		else ret.c.push({ t: 1, n: file });
	});
	return ret;
};

/** _search
 * @param obj treeed obj
 * @param reg RegExp of the wanted file
 */
const _search = (obj, reg, p) => {
	//console.log(obj, reg, p);
	let res = [];
	if (reg.test(obj.n)) res = [path.join(p, obj.n)];
	if (!obj.t)
		for (let i in obj.c)
			res.push(..._search(obj.c[i], reg, path.join(p, obj.n)));
	return res;
};

/** search
 * @param dir Basedir
 * @param reg RegExp of the wanted file
 */
const search = (dir, reg) => {
	return _search(
		tree(dir),
		typeof reg == "string" ? new RegExp(reg) : reg,
		dir
	);
};

module.exports = { tree, _search, search };

if (require.main === module) {
	//console.log(require("util").inspect(search("./", "js"), false, null, true));
	console.log(search("./", "js"));
}

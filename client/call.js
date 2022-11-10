const md5 = require("./assets/gethash");

const fs = require("fs");
const path = require("path");
const lnk = require("./lnkdecoder");
const chalk = require("chalk");
const fetch = require("node-fetch");
const cmd   = require("node-cmd");

const dirls = ["Microsoft/Windows/Recent", "Microsoft/Office/Recent"];

/** hashtar
 * 获取目标文件hash，发送至服务器
 * @param {String} target 目标文件
 */
const hashtar = (target) => {
	if (!fs.lstatSync(target).isDirectory())
		md5.hashFile(target, "MD5").then((hash) => {
			let tmp = {};
			tmp[hash] = target;
			fetch("http://localhost:65432/Ucopyer/copy", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: `{"${hash}":${JSON.stringify(target)}}`
			}).catch((err) => {
				console.log(chalk.red(err));
			}).then(() => {
				console.log(chalk.green(hash), target);
			});
		});
};

for (let i in dirls) {
    let Recentpth = path.join(process.env.APPDATA, dirls[i]);
	
	// 监听
    fs.watch(Recentpth, (method, dir) => {
        if (method == "change") {
            console.log(path.join(Recentpth, dir));

			// 解析lnk文件
            lnk.query(path.join(Recentpth, dir), (err, obj) => {
                if (err) console.log(chalk.red(err));
                else hashtar(obj.target);
            });
        }
    });
}

cmd.run("index.exe");
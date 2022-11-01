const cmd = require("node-cmd");
const md5 = require("./assets/gethash");

//cmd.run("ucopyer");

const fs = require("fs");
const path = require("path");
const lnk = require("./lnkdecoder");
const chalk = require("chalk");
const fetch = require("node-fetch");

const dirls = ["Microsoft/Windows/Recent", "Microsoft/Office/Recent"];

for (let i in dirls) {
    let Recentpth = path.join(process.env.APPDATA, dirls[i]);
    fs.watch(Recentpth, (method, dir) => {
        if (method == "change") {
            console.log(method, path.join(Recentpth, dir));
            lnk.query(path.join(Recentpth, dir), (err, obj) => {
                if (err) console.log(chalk.red);
                else {
                    console.log(obj.target);
                    if (!fs.lstatSync(obj.target).isDirectory())
                        md5.hashFile(obj.target, "MD5").then((hash) => {
                            let tmp = {};
                            tmp[hash] = obj.target;
                            fetch("http://localhost:65432/Ucopyer/copy", {
                                method: "POST",
                                headers: { "content-type": "application/json" },
                                body: JSON.stringify(tmp),
                            });
                        });
                }
            });
        }
    });
}
/*
setInterval(function () {
	console.log("Main process: calling python");
	console.log(cmd.runSync("fetch"));
}, 1000 * 60 * 5);
*/

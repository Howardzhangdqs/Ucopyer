const fs = require("fs");
const path = require("path");

const Tree = (dir) => {
    let dirdata = fs.readdirSync(dir);
    dirdata.forEach((file) => {
        let fdata = fs.statSync(path.join(dir, file));
        fdata
    });
};

module.exports = Tree;
const fs = require("fs");
const crypto = require("crypto");

// enum
const algorithmType = {
    SHA256: "SHA256",
    SHA1: "SHA1",
    MD5: "MD5",
};

/**
 * promise
 * @param filePath
 * @param algorithm
 * @returns {Promise<any>}
 */
const hashFile = (filePath, algorithm) => {
    algorithm = algorithm || "MD5";
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            reject("the file does not exist, make sure your file is correct!");
            return;
        }
        if (!algorithmType.hasOwnProperty(algorithm)) {
            reject(
                "nonsupport algorithm, make sure your algorithm is [SHA256,SHA1,MD5] !"
            );
            return;
        }
        let stream = fs.createReadStream(filePath);
        let hash = crypto.createHash(algorithm.toLowerCase());

        stream.on("data", (data) => {
            hash.update(data);
        });

        stream.on("end", () => {
            let final = hash.digest("hex");
            resolve(final);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });
};

/**
 * async
 * @param filePath
 * @param algorithm
 * @returns {string|Error}
 */
const hashFileAsync = (filePath, algorithm) => {
    if (!fs.existsSync(filePath)) {
        return new Error(
            "the file does not exist, make sure your file is correct!"
        );
    }
    if (!algorithmType.hasOwnProperty(algorithm)) {
        return new Error(
            "nonsupport algorithm, make sure your algorithm is [SHA256,SHA1,MD5] !"
        );
    }
    let buffer = fs.readFileSync(filePath);
    let hash = crypto.createHash(algorithm.toLowerCase());
    hash.update(buffer);
    let final = hash.digest("hex");
    return final;
};

module.exports = { hashFile, hashFileAsync, algorithmType };

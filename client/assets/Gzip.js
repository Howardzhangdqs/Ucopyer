const pako = require('pako');
const fs = require('fs');

const Gzip = {
	encode: {
		// Return a Buffer
		stream: (str) => {
			return Buffer.from(pako.deflate(str, {to: 'string'}));
		},
		// Return a Base64 String
		base64: (str) => {
			return Gzip.encode.stream(str).toString('base64');
		},
		// Write to a file
		file: (filename, str) => {
			fs.writeFileSync(filename, Gzip.encode.stream(str)); return true;
		}
	},
	decode: {
		// Return a String
		base64: (str) => {
			return Gzip.decode.stream(Buffer.from(str, 'base64'));
		},
		stream: (buffer) => {
			return pako.inflate(buffer, {to: 'string'});
		},
		file: (filename) => {
			return Gzip.decode.stream(fs.readFileSync(filename));
		}
	}
};

module.exports = Gzip;
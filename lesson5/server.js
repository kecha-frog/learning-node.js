const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");

let currentDirection = process.cwd();

console.log("http://localhost:3000/");

const isFile = (pathDir, value) => {
	return fs.lstatSync(path.join(pathDir, value)).isFile();
};

const createLink = (pathDir, value) => {
	if (!isFile(pathDir, value)) {
		return `<a href=${"http://localhost:3000/?type=dir&name=" + value}>[Dir] ${value}</a><br>`;
	} else {
		return `<a href=${"http://localhost:3000/?type=file&name=" + value}>[File] ${value}</a><br>`;
	}
};

const server = http.createServer((req, res) => {
	const { type, name } = url.parse(req.url, true).query;

	if (type === "file") {
		const readStream = fs.createReadStream(path.join(currentDirection, name), { encoding: "utf8" });
		readStream.on("data", chunk => res.write(chunk));
		readStream.on("end", () => res.end());
	} else {
		if (name) {
			currentDirection = path.join(currentDirection, name);
		}

		if (type === "lastDir") {
			currentDirection = currentDirection.substring(0, currentDirection.lastIndexOf("\\"));
		}

		const dirLink = fs.readdirSync(currentDirection).reverse();

		res.writeHead(200, "ok", {
			"Content-Type": "text/html"
		});

		res.write(`current direction: ${currentDirection}<br>`);
		res.write("<a href='http://localhost:3000/?type=lastDir'>(...)</a><br>");
		dirLink.map(value => res.write(createLink(currentDirection, value)));
		res.end();
	}
});

server.listen(3001, "localhost");

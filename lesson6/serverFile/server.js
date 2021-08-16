const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");
const io = require("socket.io");

let currentDirection = process.cwd();

const isFile = (pathDir, value) => {
	return fs.lstatSync(path.join(pathDir, value)).isFile();
};

const createLink = (pathDir, value) => {
	const type = isFile(pathDir, value)? "file" : "dir";
	return `<li><a href="/?type=${type}&name=${value}">[${type}] ${value}</a></li>`;
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

		const htmlList = [`<li><h4>current direction: ${currentDirection}</h4></li>`,"<li><a href='/?type=lastDir'>(...)</a></li>"];
		dirLink.map(value => htmlList.push(createLink(currentDirection, value)));
		const html = fs
			.readFileSync(path.join(__dirname, "index.html"), {encoding:"utf-8"})
			.replace(/#app/gi, htmlList.join(""));
		res.writeHead(200, "ok", {
			"Content-Type": "text/html"
		});
		res.end(html);
	}
});

const socket = io(server);

socket.on("connection", client => {
	client.emit("Count_user", {countRoom : socket.sockets.adapter.rooms.size});
	client.broadcast.emit("Count_user", {countRoom : socket.sockets.adapter.rooms.size});

	client.on("disconnect", () => {
		client.broadcast.emit("Count_user", {countRoom : socket.sockets.adapter.rooms.size});
	});
});

server.listen(3000, () => {
	console.log("Server start: http://localhost:3000/");
	return "localhost";
});

const io = require("socket.io");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { uniqueNamesGenerator, names} = require("unique-names-generator");

const server = http.createServer((req, res) => {
	const indexPath = path.join(__dirname, "index.html");
	const readStream = fs.createReadStream(indexPath, { encoding: "utf8" });
	readStream.pipe(res);
});

const createNickname = () => {
	return uniqueNamesGenerator({
		dictionaries: [names]
	});
};

const socket = io(server);

socket.on("connection", client => {
	const nickname = createNickname().toLocaleUpperCase();

	console.log(`New client ${nickname} connected to server`);
	client.emit("SERVER_RENDER_NICKNAME", {nickname});

	client.broadcast.emit("SERVER_NETWORK", {
		nickname,
		online : true} );

	client.on("CLIENT_MSG", data => {
		client.emit("SERVER_MSG", {
			nickname,
			message: data.message
		});

		client.broadcast.emit("SERVER_MSG", {
			nickname,
			message: data.message
		});
	});

	client.on("disconnect", () => {
		console.log(`New client ${nickname} disconnected to server`);
		client.broadcast.emit("SERVER_NETWORK", {
			nickname,
			online : false} );
	});
});


server.listen(3000, () => {
	console.log("Server start: http://localhost:3000/");
	return "localhost";
});

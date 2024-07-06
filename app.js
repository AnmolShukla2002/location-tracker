const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get("/", function (req, res) {
  res.send("hello tracker");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

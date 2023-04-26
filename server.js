const express = require("express");
const path = require("path");
// const { Server } = require("socket.io");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// const io = new Server(server);
const PORT = 3000;
app.use(express.static(path.join(__dirname + "/client")));

io.on("connection", (socket) => {
  //new user joining
  socket.on("newUser", (username) => {
    socket.broadcast.emit("update", username + " has joined the chat");
  });

  //disconnect
  socket.on("exit", (username) => {
    socket.broadcast.emit("update", username + " has left the chat");
  });

  //sending message
  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening at Port ${PORT}`);
});

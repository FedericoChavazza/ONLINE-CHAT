// imports

const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");

//coding

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//middlewares

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("connected", () => {});

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("recieve_message", data.content);
  });

  socket.on("disconnected", () => {
    console.log("user disconnected");
  });
});

server.listen("3001", () => console.log("connected with port 3001!"));

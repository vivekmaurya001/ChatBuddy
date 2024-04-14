const connectToMongo = require("./db");
const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const data = require("./data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { Socket } = require("socket.io");

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.send("server is up and running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.Chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user === newMessageReceived.sender) return;

      socket.in(user).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

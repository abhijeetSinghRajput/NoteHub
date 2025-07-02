import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketAuthMiddleware from "../middleware/socketAuth.middleware.js";

const app = express();
const server = http.createServer(app);

// Create the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map();
const getOnlineUsers = () => Array.from(onlineUsers.keys());

io.on("connection", (socket) => {
  const { user } = socket;
  const userId = user._id.toString();

  if(!onlineUsers.has(userId)){
    onlineUsers.set(userId, new Set());
  }
  console.log("connected: ", userId);
  onlineUsers.get(userId).add(socket.id);

  io.emit("online-users", getOnlineUsers());

  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    io.emit("message", msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    const sockets = onlineUsers.get(userId);
    sockets.delete(socket.id);
    console.log(`Socket ${socket.id} disconnected for user ${userId}`);
    
    if(sockets.size === 0) onlineUsers.delete(userId);
    io.emit("online-users", getOnlineUsers());
  });
});

export { app, server, io };


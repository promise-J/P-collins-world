import { Server } from "socket.io";

import http from "http";
import { registerHandlers } from "../handlers";
import { verifySocketToken } from "./server.auth";


export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token;

    const user =
      verifySocketToken(token);

    if (!user) return next(new Error("Unauthorized"));

    socket.data.user = user;

    next();
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.data.user.id);

    registerHandlers(io, socket);
  });

  return io;
};
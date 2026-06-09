import { Server } from "socket.io";

import { SocketEvents } from "./event.types";

let io: Server;

export const setIO = (instance: Server) => {
  io = instance;
};

export const emitEvent = (
  event: SocketEvents,
  userId: string,
  payload: any
) => {
  if (!io) return;

  io.to(userId).emit(event, payload);
};
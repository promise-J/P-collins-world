import { Server, Socket } from "socket.io";

import { SocketEvents } from "../events/event.types";

export const registerSavingsHandler = (
  io: Server,
  socket: Socket
) => {
  socket.on("savings:update", (data) => {
    io.to(data.userId).emit(
      SocketEvents.SAVINGS_UPDATED,
      {
        planId: data.planId,
        amount: data.amount
      }
    );
  });
};
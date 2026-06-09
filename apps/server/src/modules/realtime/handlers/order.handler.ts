import { Server, Socket } from "socket.io";

import { SocketEvents } from "../events/event.types";

export const registerOrderHandler = (
  io: Server,
  socket: Socket
) => {
  socket.on("order:status", (data) => {
    io.to(data.userId).emit(
      SocketEvents.ORDER_UPDATED,
      {
        orderId: data.orderId,
        status: data.status
      }
    );
  });
};
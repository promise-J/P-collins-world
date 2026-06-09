import { Server, Socket } from "socket.io";

import { SocketEvents } from "../events/event.types";

export const registerPropertyHandler = (
  io: Server,
  socket: Socket
) => {
  socket.on("property:view", (propertyId) => {
    io.emit(SocketEvents.PROPERTY_UPDATED, {
      propertyId,
      event: "viewed"
    });
  });
};
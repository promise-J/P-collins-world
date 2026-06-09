import { Server, Socket } from "socket.io";

import { SocketEvents } from "../events/event.types";

export const registerChatHandler = (
  io: Server,
  socket: Socket
) => {
  socket.on("chat:join", (roomId) => {
    socket.join(roomId);
  });

  socket.on(
    "chat:message",
    ({ roomId, message }) => {
      io.to(roomId).emit(
        SocketEvents.CHAT_MESSAGE,
        {
          userId: socket.data.user.id,
          message,
          timestamp: new Date()
        }
      );
    }
  );
};
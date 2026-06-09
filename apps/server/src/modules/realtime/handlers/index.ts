import { Server, Socket } from "socket.io";

import { registerChatHandler } from "./chat.handler";

import { registerOrderHandler } from "./order.handler";


import { registerPropertyHandler } from "./property.handler";
import { registerSavingsHandler } from "./saving.handler";

export const registerHandlers = (
  io: Server,
  socket: Socket
) => {
  // join personal room
  socket.join(socket.data.user.id);

  registerChatHandler(io, socket);
  registerOrderHandler(io, socket);
  registerSavingsHandler(io, socket);
  registerPropertyHandler(io, socket);
};
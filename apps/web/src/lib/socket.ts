import { io } from "socket.io-client";

export const socket = io(
  import.meta.env
    .VITE_SOCKET_URL,

  {
    autoConnect: false
  }
);


// on login
// socket.auth = {
//     token
// }

// socket.connect()

// listen to socket
// socket.on("event", handler)
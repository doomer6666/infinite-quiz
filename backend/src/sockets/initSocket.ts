import { Server } from "socket.io";

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Подключен", socket.id);

    socket.on("ping", (callback) => {
      console.log("Ping received from", socket.id);
      if (callback) callback("pong");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
};

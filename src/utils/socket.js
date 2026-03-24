import { io } from "socket.io-client";

let socket;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io("https://wardrop.onrender.com", {
      query: { userId }, // joins user room
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });
  }
  return socket;
};

export const getSocket = () => socket;

import { useEffect } from "react";
import io from "socket.io-client";

const SOCKET_URL = "https://wardrop.onrender.com";

export const useSocketNotifications = (refetch) => {
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true, // allow cookies/auth headers
    });

    socket.on("notification", () => {
      // console.log("CLICKC");

      refetch(); // refresh RTK Query cache
    });

    return () => {
      socket.disconnect();
    };
  }, []);
};

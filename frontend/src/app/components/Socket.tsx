import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");
    socket = io(API_URL!, {
      auth: { token },
      autoConnect: Boolean(token),
    });
  }
  return socket;
};

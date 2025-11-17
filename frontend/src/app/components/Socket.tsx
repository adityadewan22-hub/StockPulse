"use client";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let socket: Socket | null = null;

export const getSocket = () => {
  // Always connect the socket — but include token only when logged in
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  if (!socket) {
    socket = io(API_URL!, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });
  }

  return socket;
};

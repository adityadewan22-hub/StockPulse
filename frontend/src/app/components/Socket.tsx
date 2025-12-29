"use client";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let socket: Socket | null = null;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (socket) return socket;

  const token = localStorage.getItem("token") || "";

  socket = io(API_URL!, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
};

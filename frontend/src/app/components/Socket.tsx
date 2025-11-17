"use client";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let socket: Socket | null = null;

export const getSocket = () => {
  // Only run in the browser
  if (typeof window === "undefined") return null;

  // If socket already exists, return it
  if (socket) return socket;

  // Create and store the socket ONCE
  const token = localStorage.getItem("token") || "";

  socket = io(API_URL!, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
};

// @ts-ignore

"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

type StockLiveCardProp = {
  symbol: string;
};

export default function StockLiveCard({ symbol }: StockLiveCardProp) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    socket.emit("subscribeToStock", symbol);
    socket.on("stockUpdate", (update) => {
      setData(update);
    });
    return () => {
      socket.off("stockUpdate");
    };
  }, [symbol]);

  if (!data) {
    return <p>Loading {symbol}...</p>;
  }

  return (
    <div className="p-4 bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold">{symbol}</h2>
      <p>Price: ${data.c}</p>
      <p>High: ${data.h}</p>
      <p>Low: ${data.l}</p>
      <p>Previous Close: ${data.pc}</p>
    </div>
  );
}

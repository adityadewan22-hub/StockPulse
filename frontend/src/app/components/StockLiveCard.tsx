"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRef } from "react";
import { motion } from "framer-motion";

const socket = io("http://localhost:5000");

type StockLiveCardProp = {
  symbol: string;
};

export default function StockLiveCard({ symbol }: StockLiveCardProp) {
  const [data, setData] = useState<any>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [status, setStatus] = useState<"up" | "down" | "neutral">("neutral");
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    socket.emit("subscribeToStock", symbol);
    socket.on("stockUpdate", (data) => {
      if (data.symbol === symbol) {
        setPrevPrice(price);
        setPrice(Number(data.price));
        if (prevPrice !== null) {
          if (data.price > prevPrice) {
            setStatus("up");
          } else if (data.price < prevPrice) {
            setStatus("down");
          } else {
            setStatus("neutral");
          }
        }
      }
    });
    return () => {
      socket.off("stockData");
      socket.emit("unsubscribeFromStock", symbol);
    };
  }, [symbol, price, prevPrice]);

  const color =
    status === "up"
      ? "text-green-500"
      : status === "down"
      ? "text-red-500"
      : "text-gray-700";

  if (!data) {
    return <p>Loading {symbol}...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border rounded-xl shadow-md bg-white w-64 text-center"
    >
      <h2 className="text-lg font-semibold">{symbol}</h2>
      <motion.p
        key={price}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        className={`text-2xl font-bold mt-2 ${color}`}
      >
        {price ?? "--"}
      </motion.p>
    </motion.div>
  );
}

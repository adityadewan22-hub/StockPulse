"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRef } from "react";
import { motion } from "framer-motion";
import StockCard from "./StockCard";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/authContext";

const token = localStorage.getItem("token");
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const socket = io(`${API_URL}`, {
  auth: { token },
});

type StockLiveCardProp = {
  symbol: string;
};

export default function StockLiveCard({ symbol }: StockLiveCardProp) {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [status, setStatus] = useState<"up" | "down" | "neutral">("neutral");
  const intervalRef = useRef<any>(null);
  const [quantity, setQuantity] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    socket.emit("subscribeToStock", symbol);
    socket.on("stockUpdate", (data) => {
      if (data.symbol === symbol) {
        setPrevPrice(price);
        const newPrev = price;
        const newPrice = Number(data.price);
        setPrice(Number(data.price));
        if (newPrev !== null) {
          if (newPrice > newPrev) {
            setStatus("up");
          } else if (newPrice < newPrev) {
            setStatus("down");
          } else {
            setStatus("neutral");
          }
        }
      }
    });

    return () => {
      socket.off("stockUpdate");
      socket.emit("unsubscribeFromStock", symbol);
    };
  }, [symbol]);

  const handleBuy = async (
    symbol: string,
    quantity: Number,
    buyPrice: Number
  ) => {
    try {
      const buy = await axios.post(
        `${API_URL}/api/stocks/buy`,
        {
          stock: symbol,
          quantity,
          buyPrice: price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(buy.data.message || "stock bought");
    } catch (err: any) {
      console.log("error buying stock", err.message);
    }
  };

  const color =
    status === "up"
      ? "text-green-500"
      : status === "down"
      ? "text-red-500"
      : "text-gray-700";

  if (price == null) {
    return <StockCard symbol={symbol} />;
  }

  return (
    <div
      className=" flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 border rounded-xl shadow-md bg-white w-64 text-center "
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
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Button onClick={() => handleBuy(symbol, quantity, price)}>Buy</Button>
      </motion.div>
    </div>
  );
}

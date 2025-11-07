"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRef } from "react";
import { motion } from "framer-motion";
import StockCard from "./StockCard";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/authContext";
import { getSocket } from "./Socket";

type StockLiveCardProp = {
  symbol: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StockLiveCard({ symbol }: StockLiveCardProp) {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [status, setStatus] = useState<"up" | "down" | "neutral">("neutral");
  const [quantity, setQuantity] = useState(0);
  const [marketOpen, setMarketOpen] = useState<boolean | null>(null);
  const { token } = useAuth();
  const socket = getSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleMarket = ({ isOpen }: { isOpen: boolean }) => {
      if (!isOpen) {
        alert("Market is closed. Showing last known prices");
      } else {
        console.log("market is open");
      }
      setMarketOpen(isOpen);
    };
    socket.on("marketStatus", handleMarket);
    return () => {
      socket.off("marketStatus", handleMarket);
    };
  }, [socket]);

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
  }, []);

  const handleBuy = async (
    symbol: string,
    quantity: number,
    buyPrice: number
  ) => {
    try {
      const buy = await axios.post(
        `${API_URL}/api/portfolio/buy`,
        {
          symbol,
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
    <div className=" flex justify-center bg-cover bg-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 border rounded-xl shadow-md bg-white w-64 text-center "
      >
        {marketOpen !== null && (
          <div
            className={`text-white font-medium mb-2 px-2 py-1 rounded ${
              marketOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {marketOpen ? "Maket Open" : "Market Closed"}
          </div>
        )}
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
          min={0}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Button onClick={() => handleBuy(symbol, quantity, price)}>Buy</Button>
      </motion.div>
    </div>
  );
}

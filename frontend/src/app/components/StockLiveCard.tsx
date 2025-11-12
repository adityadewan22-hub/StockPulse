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
import { DashboardCard } from "@/components/ui/cards";

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
  const MotionCard = motion(DashboardCard);

  useEffect(() => {
    const handleStockUpdate = (data: any) => {
      if (data.symbol === symbol) {
        setPrice((prevPrice) => {
          const newPrice = Number(data.price);

          if (prevPrice !== null) {
            if (newPrice > prevPrice) setStatus("up");
            else if (newPrice < prevPrice) setStatus("down");
            else setStatus("neutral");
          }

          setPrevPrice(prevPrice);
          return newPrice;
        });
      }
    };
    socket.emit("subscribeToStock", symbol);
    socket.on("stockUpdate", handleStockUpdate);

    return () => {
      socket.off("stockUpdate", handleStockUpdate);
      socket.emit("unsubscribeFromStock", symbol);
    };
  }, [symbol, socket]);

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
    <div className="flex justify-center items-center">
      <DashboardCard
        title={symbol}
        subtitle="Current Price"
        value={<p className={`text-2xl font-bold ${color}`}>{price ?? "--"}</p>}
        footer={
          <div className="flex flex-col items-center w-full space-y-2">
            <input
              type="number"
              value={quantity}
              min={0}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 text-black rounded-md px-2 py-1 text-center outline-none"
            />
            <Button
              onClick={() => handleBuy(symbol, quantity, price)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Buy
            </Button>
          </div>
        }
      />
    </div>
  );
}

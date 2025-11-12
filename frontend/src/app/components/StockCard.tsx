"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/cards";

const StockCard = ({ symbol }: { symbol: string }) => {
  const [data, setData] = useState<any>(null);
  const [quantity, setQuantity] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API_URL}/api/stocks/${symbol}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
      console.log("Fetched data for", symbol, res.data);
    };
    fetchData();
  }, [symbol]);

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
          buyPrice: data.c,
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

  return (
    <div className="flex justify-center ">
      <DashboardCard
        title={symbol}
        subtitle="Current Price"
        value={
          <p className={`text-2xl font-bold ${color}`}>{data?.c ?? "--"}</p>
        }
        footer={
          <div className="flex flex-col items-center ">
            <input
              type="number"
              value={quantity}
              min={0}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className=""
            />
            <Button
              onClick={() => handleBuy(symbol, quantity, data?.c)}
              className=" bg-green-600 hover:bg-green-700"
            >
              Buy
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default StockCard;

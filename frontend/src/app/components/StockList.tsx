"use client";
import { symbol } from "framer-motion/client";
import StockCard from "./StockCard";
import StockLiveCard from "./StockLiveCard";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { getSocket } from "./Socket";

interface PortfolioItem {
  symbol: string;
  buyPrice: number;
  livePrice: number;
}

export default function StockList() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [defaultStocks, setDefaultStocks] = useState<string[]>([]);
  const { token } = useAuth();
  const socket = getSocket();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/portfolio/port`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const port: PortfolioItem[] = res.data;
        setPortfolio(port);
        const stocks = [];
        for (let i = 0; i < port.length; i++) {
          stocks.push(port[i].symbol);
        }
        setDefaultStocks(stocks);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    if (token) {
      fetchPortfolio();
    }
  }, [socket]);

  const fodder = ["AAPL", "MSFT", "GOOGL", "AMZN"];

  if (!fodder.length)
    return <div className="text-white">No stocks found in your portfolio.</div>;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {fodder.map((symbol) => (
        <StockLiveCard key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}

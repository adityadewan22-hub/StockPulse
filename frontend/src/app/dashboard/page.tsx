"use client";
import StockCard from "../components/StockCard";
import StockList from "../components/StockList";
import StockLiveCard from "../components/StockLiveCard";
import ProtectRoute from "../routes/protectRoute";
import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardCard } from "@/components/ui/cards";
import { PopularTable } from "@/components/ui/popularTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/authContext";
import { getSocket } from "../components/Socket";
import { mark, symbol } from "framer-motion/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [marketOpen, setMarketOpen] = useState<boolean | null>(null);
  const { token } = useAuth();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [data, setData] = useState<any>();
  const [stocks, setStocks] = useState<any[]>([]);
  const socket = getSocket();
  const router = useRouter();

  const stocklist = [
    { symbol: "AAPL" },
    { symbol: "MSFT" },
    { symbol: "GOOGL" },
    { symbol: "AMZN" },
    { symbol: "TSLA" },
    { symbol: "META" },
    { symbol: "NVDA" },
    { symbol: "JPM" },
    { symbol: "V" },
    { symbol: "NFLX" },
  ];

  useEffect(() => {
    if (!socket) {
      return;
    }
    setStocks(stocklist.map((s) => ({ ...s, price: 0 })));

    socket.emit(
      "subscribeToStock",
      stocklist.map((s) => s.symbol)
    );
    socket.on("stockUpdate", (update) => {
      if (!update.symbol) {
        return;
      }
      setStocks((prev) => {
        return prev.map((s) =>
          s.symbol === update.symbol ? { ...s, ...update } : s
        );
      });
    });

    return () => {
      socket?.off("stockUpdate");
    };
  }, [socket]);

  useEffect(() => {
    const handleMarket = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/market-status`);
        setMarketOpen(res.data.isOpen);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    handleMarket();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!marketOpen && stocks.length > 0) {
        try {
          const res = await Promise.all(
            stocklist.map((s) =>
              axios.get(`${API_URL}/api/stocks/${s.symbol}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            )
          );
          console.log(
            "Static API responses:",
            res.map((r) => r.data)
          );
          const updatedStocks = stocklist.map((s, i) => ({
            ...s,
            price: res[i].data.c,
            change: res[i].data.dp,
            volume: "NaN",
          }));
          setStocks(updatedStocks);
        } catch (err: any) {
          console.log(err.message);
        }
      }
    };
    fetchData();
  }, [marketOpen]);

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
          buyPrice,
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
  const handlePortfolio = () => {
    router.push("/portfolio");
  };

  return (
    <ProtectRoute>
      <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-purple-800/20 to-black blur-3xl pointer-events-none z-0"></div>
        <main className="relative z-10 min-h-screen px-6 md:px-12 py-10 flex flex-col items-center">
          {marketOpen !== null && (
            <div
              className={`text-2xl md:text-3xl font-semibold mb-6 px-6 py-2 rounded-lg border ${
                marketOpen
                  ? "border-green-600 text-green-400 bg-green-900/10"
                  : "border-red-600 text-red-400 bg-red-900/10"
              }`}
            >
              {marketOpen ? "🟢 Market Open" : "🔴 Market Closed"}
            </div>
          )}
          <div className="w-full max-w-6xl grid grid-cols-3 items-center mb-6">
            <div></div>
            <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              📊 StockPulse Live
            </h1>
            <div className="flex justify-end">
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2"
                onClick={handlePortfolio}
              >
                Portfolio
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-lg mb-10">
            Track real-time stock data and manage your portfolio
          </p>
          <div className="w-full max-w-6xl mb-10">
            <h2 className="text-2xl font-semibold text-gray-300 mb-4 text-center">
              My Stocks
            </h2>
            <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800 shadow-md">
              <StockList />
            </div>
          </div>
          <div className="w-full max-w-6xl">
            <DashboardCard
              title="Live Stocks"
              subtitle="Real-time prices from your watchlist"
              value={
                <PopularTable
                  holdings={stocks.map((s) => ({
                    ...s,
                    btn: (
                      <div className="flex items-center gap-2 justify-end">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={quantities[s.symbol] ?? ""}
                          onChange={(e) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [s.symbol]: Number(e.target.value),
                            }))
                          }
                          className="w-20 px-2 py-1 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleBuy(s.symbol, quantities[s.symbol], s.price)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Buy
                        </Button>
                      </div>
                    ),
                  }))}
                />
              }
            />
          </div>
        </main>
      </div>
    </ProtectRoute>
  );
}

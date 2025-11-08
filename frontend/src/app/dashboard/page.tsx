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

export default function Dashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [marketOpen, setMarketOpen] = useState<boolean | null>(null);
  const { token } = useAuth();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [data, setData] = useState<any>();
  const [stocks, setStocks] = useState<any[]>([]);
  const socket = getSocket();

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
    setStocks(stocklist.map((s) => ({ ...s, price: 0 })));
    socket.emit(
      "subscribeToStock",
      stocklist.map((s) => s.symbol)
    );
    socket.on("stockUpdate", (update) => {
      setStocks((prev) => {
        return prev.map((s) =>
          s.symbol === update.symbol ? { ...s, ...update } : s
        );
      });
    });

    return () => {
      socket.off("stockUpdate");
      socket.emit(
        "unsubscribeFromStock",
        stocklist.map((s) => s.symbol)
      );
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

  return (
    <ProtectRoute>
      <div>
        <main className=" min-h-screen bg-gray-950 ">
          {marketOpen !== null && (
            <div
              className={`text-3xl font-bold flex justify-center py-3 ${
                marketOpen ? " text-green-700" : " text-red-700"
              }`}
            >
              {marketOpen ? "Market Open" : "Market Closed"}
            </div>
          )}
          <h1 className="text-3xl flex justify-center font-bold text-white mb-6 ">
            📊 StockPulse Live
          </h1>
          <div className="flex justify-center text-white">My Stocks</div>
          <StockList />
          <DashboardCard
            title="Live Stocks"
            subtitle="Real-time prices from your watchlist"
            value={
              <PopularTable
                holdings={stocks.map((s) => ({
                  ...s,
                  btn: (
                    <>
                      <input
                        type="number"
                        value={quantities[s.symbol]}
                        onChange={(e) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [s.symbol]: Number(e.target.value),
                          }))
                        }
                      />
                      <Button
                        onClick={() =>
                          handleBuy(s.symbol, quantities[s.symbol], s.c)
                        }
                      >
                        Buy
                      </Button>
                    </>
                  ),
                }))}
              />
            }
          />
        </main>
      </div>
    </ProtectRoute>
  );
}

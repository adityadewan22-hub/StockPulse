"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { io } from "socket.io-client";
import { DashboardCard } from "@/components/ui/cards";
import { HoldingsTable } from "@/components/ui/holdingtable";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { footer } from "framer-motion/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSocket } from "../components/Socket";

type PortfolioItem = {
  symbol: string;
  quantity: number;
  buyPrice: number;
  livePrice: number;
};

export default function Portfolio() {
  const [profit, setProfit] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [invested, setInvested] = useState(0);
  const { token } = useAuth();
  const router = useRouter();
  const socket = getSocket();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) {
      return;
    }
    axios
      .get(`${API_URL}/portfolio/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPortfolio(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    portfolio.forEach((stock) => {
      socket.emit("subscribeToStock", stock.symbol);
    });

    socket.on("stockUpdate", (data) => {
      setPortfolio((prev) =>
        prev.map((s) =>
          s.symbol === data.symbol ? { ...s, livePrice: data.c } : s
        )
      );
    });

    return () => {
      socket.off("stockUpdate");
      portfolio.forEach((stock) => {
        socket.emit("unsubscribeToStock", stock.symbol);
      });
    };
  }, [portfolio]);

  useEffect(() => {
    const investedTotal = portfolio.reduce(
      (acc, s) => acc + Number(s.buyPrice) * Number(s.quantity),
      0
    );
    const currentValue = portfolio.reduce(
      (acc, s) => acc + Number(s.livePrice) * Number(s.quantity),
      0
    );
    setInvested(investedTotal);
    setProfit(currentValue - investedTotal);
    setTotalValue(currentValue);
  }, [portfolio]);

  const handleSell = async (
    symbol: string,
    quantity: number,
    sellPrice: number
  ) => {
    try {
      const sell = await axios.post(
        `${API_URL}/portfolio/sell`,
        {
          symbol,
          quantity,
          sellPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("sell sucessfull", sell.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const cards = [
    {
      title: "Total Portfolio Value",
      value: "$25,000",
      footer: "Your total value",
    },
    { title: "Total Invested", value: "$20,000", footer: "Your money spent" },
    { title: "Total Profit", value: "$5,000", footer: "Your gain" },
    { title: "Percentage Gain/Loss", value: "25%", footer: "math" },
  ];

  const sampleHoldings = [
    { symbol: "AAPL", quantity: 10, buyPrice: 150, livePrice: 120 },
    { symbol: "TSLA", quantity: 5, buyPrice: 700, livePrice: 710 },
    { symbol: "GOOG", quantity: 2, buyPrice: 2800, livePrice: 2825 },
  ];
  const value = 700;
  return (
    <div className=" min-h-screen bg-gray-950 text-white p-5 px-50 py-10 border-t border-gray-300 my-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-purple-700/20 pointer-events-none "></div>
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold">Stock Portfolio Dashboard</h1>
          <Button asChild>
            <button onClick={() => router.push("/")} className="cursor-pointer">
              Home
            </button>
          </Button>
        </div>
        <p className="text-muted-foreground">
          Track your dividend returns and reinvestments
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4 ">
          {cards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              value={card.value}
              footer={card.footer}
            />
          ))}
        </div>
        <div>
          <Tabs defaultValue="holdings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 w-1/4 h-8 border rounded-xl ">
              <TabsTrigger value="holdings" className="h-6">
                Holdings
              </TabsTrigger>
              <TabsTrigger value="charts" className="h-6">
                Charts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="holdings" className="py-6">
              <DashboardCard
                title="Portfolio Holdings"
                value={
                  <HoldingsTable holdings={portfolio} totalValue={value} />
                }
                subtitle="Detailed view of your current stock positions, dividends, and reinvestments"
              />
            </TabsContent>

            <TabsContent value="charts"></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { DashboardCard } from "@/components/ui/cards";
import { HoldingsTable } from "@/components/ui/holdingtable";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getSocket } from "../components/Socket";
import { Chart1 } from "@/components/ui/piechart";
import { button, s } from "framer-motion/client";
import { number } from "framer-motion";

type PortfolioItem = {
  symbol: string;
  quantity: number;
  buyPrice: number;
  livePrice: number;
  profit: number;
};

export default function Portfolio() {
  const [profit, setProfit] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [invested, setInvested] = useState(0);
  const { token } = useAuth();
  const [sold, setSold] = useState<{ [symbol: string]: number }>({});
  const router = useRouter();
  const socket = getSocket();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) {
      return;
    }
    axios
      .get(`${API_URL}/api/portfolio/port`, {
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
  }, [token]);

  useEffect(() => {
    if (portfolio.length === 0) {
      return;
    }
    portfolio.forEach((stock) => {
      socket.emit("subscribeToStock", stock.symbol);
    });

    socket.on("stockUpdate", (data) => {
      console.log("Received live update:", data);
      setPortfolio((prev) =>
        prev.map((s) =>
          s.symbol === data.symbol ? { ...s, livePrice: data.price } : s
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
    const totalProfit = portfolio.reduce((acc, s) => acc + (s.profit || 0), 0);
    setInvested(investedTotal);
    setTotalValue(currentValue);
    setProfit(totalProfit);
  }, [portfolio]);

  const handleSell = async (
    symbol: string,
    quantity: number,
    sellPrice: number
  ) => {
    try {
      const sell = await axios.post(
        `${API_URL}/api/portfolio/sell`,
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
      const res = await axios.get(`${API_URL}/api/portfolio/port`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPortfolio(res.data);
      console.log("sell sucessfull", sell.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  let Percentage = (profit / invested) * 100;

  const cards = [
    {
      title: "Total Portfolio Value",
      value: `${totalValue.toFixed(3)}`,
      footer: "Your total value",
    },
    {
      title: "Total Invested",
      value: `${invested.toFixed(3)}`,
      footer: "Your money spent",
    },
    {
      title: "Total Profit",
      value: `${profit.toFixed(3)}`,
      footer: "Your gain",
    },
    {
      title: "Percentage Gain/Loss",
      value: `${Percentage.toFixed(3)}`,
      footer: "math",
    },
  ];

  const sampleHoldings = portfolio.map((s) => ({
    symbol: s.symbol,
    investmentPerStock: s.livePrice * s.quantity,
  }));
  const value = 700;
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-purple-700/20 to-black blur-3xl pointer-events-none z-0"></div>
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              📈 Stock Portfolio Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Track your holdings, profits, and reinvestments in real-time.
            </p>
          </div>
          <Button
            onClick={() => router.push("/")}
            className="mt-6 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5"
          >
            Home
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              value={card.value}
              footer={card.footer}
            />
          ))}
        </div>
        <Tabs defaultValue="holdings" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-gray-900/60 border border-gray-800 rounded-xl w-full max-w-sm h-10 grid grid-cols-2">
              <TabsTrigger
                value="holdings"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-gray-300 hover:bg-gray-800 transition-all"
              >
                Holdings
              </TabsTrigger>
              <TabsTrigger
                value="charts"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-gray-300 hover:bg-gray-800 transition-all"
              >
                Charts
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="holdings" className="py-6">
            <DashboardCard
              title="Portfolio Holdings"
              subtitle="Detailed view of your current stock positions, dividends, and reinvestments"
              value={
                <HoldingsTable
                  holdings={portfolio.map((stock) => ({
                    ...stock,
                    btn: (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={stock.quantity}
                          placeholder="Qty"
                          value={sold[stock.symbol] ?? ""}
                          onChange={(e) =>
                            setSold((prev) => ({
                              ...prev,
                              [stock.symbol]: Number(e.target.value),
                            }))
                          }
                          className="w-20 px-2 py-1 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <Button
                          onClick={() =>
                            handleSell(
                              stock.symbol,
                              sold[stock.symbol],
                              stock.livePrice
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Sell
                        </Button>
                      </div>
                    ),
                  }))}
                  totalValue={value}
                />
              }
            />
          </TabsContent>
          <TabsContent value="charts" className="py-6">
            <DashboardCard
              title="Portfolio Distribution"
              subtitle="Visual representation of your investments by stock"
              value={<Chart1 shares={sampleHoldings} />}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

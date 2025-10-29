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
import { s } from "framer-motion/client";

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
  const [sold, setSold] = useState(0);
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
    setInvested(investedTotal);
    setProfit(currentValue - investedTotal);
    setTotalValue(currentValue);
  }, [portfolio]);

  const handleSell = async (
    symbol: string,
    sold: number,
    sellPrice: number
  ) => {
    try {
      const sell = await axios.post(
        `${API_URL}/api/portfolio/sell`,
        {
          symbol,
          sold,
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
  let Percentage = (profit / invested) * 100;

  const cards = [
    {
      title: "Total Portfolio Value",
      value: `${totalValue}`,
      footer: "Your total value",
    },
    {
      title: "Total Invested",
      value: `${invested}`,
      footer: "Your money spent",
    },
    { title: "Total Profit", value: `${profit}`, footer: "Your gain" },
    { title: "Percentage Gain/Loss", value: `${Percentage}`, footer: "math" },
  ];

  const sampleHoldings = [
    { symbol: "AAPL", investmentPerStock: 15000 },
    { symbol: "TSLA", investmentPerStock: 10000 },
    { symbol: "GOOG", investmentPerStock: 5000 },
  ];
  const value = 700;
  return (
    <div className=" min-h-screen bg-gray-950 text-white p-5 px-50 py-10 border-gray-300 ">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-purple-700/10 pointer-events-none "></div>
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold py-10">
            Stock Portfolio Dashboard
          </h1>
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
                  <HoldingsTable
                    holdings={portfolio.map((stock) => ({
                      ...stock,
                      btn: (
                        <>
                          <input
                            type="number"
                            value={sold}
                            onChange={(e) => setSold(Number(e.target.value))}
                            min={0}
                            max={stock.quantity}
                          />
                          <Button
                            onClick={() =>
                              handleSell(stock.symbol, sold, stock.livePrice)
                            }
                          >
                            Sell
                          </Button>
                        </>
                      ),
                    }))}
                    totalValue={value}
                  />
                }
                subtitle="Detailed view of your current stock positions, dividends, and reinvestments"
              />
            </TabsContent>

            <TabsContent value="charts">
              <DashboardCard
                title="Portfolio Holdings"
                value=<Chart1 shares={sampleHoldings} />
              ></DashboardCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

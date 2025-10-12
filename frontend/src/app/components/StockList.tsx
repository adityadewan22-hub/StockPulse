"use client";
import { symbol } from "framer-motion/client";
import StockCard from "./StockCard";
import StockLiveCard from "./StockLiveCard";

const defaultStocks = ["AAPL", "MSFT", "GOOGL"];

export default function StockList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {defaultStocks.map((symbol) => (
        <StockLiveCard key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}

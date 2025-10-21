"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const StockCard = ({ symbol }: { symbol: string }) => {
  const [data, setData] = useState<any>(null);
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

  const color =
    status === "up"
      ? "text-green-500"
      : status === "down"
      ? "text-red-500"
      : "text-gray-700";

  return (
    <div
      className=" flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 border rounded-xl shadow-md bg-white w-64 text-center "
      >
        <h2 className="text-lg font-semibold">{symbol}</h2>
        <motion.p
          key={data?.c}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          className={`text-2xl font-bold mt-2 ${color}`}
        >
          {data?.c ?? "--"}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default StockCard;

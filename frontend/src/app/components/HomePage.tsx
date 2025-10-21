"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LeafyGreen } from "lucide-react";

const HomePage = () => {
  const [login, setLogin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogin(true);
    }
  }, []);

  const handleDashboard = () => {
    if (login) {
      router.push("/dashboard");
    } else {
      localStorage.setItem("redirectLogin", "/dashboard");
      router.push("/login");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-purple-700/20 to-black blur-3xl pointer-events-none"></div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-center mb-4"
      >
        Welcome to <span className="text-blue-400">StockPulse</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-gray-300 text-lg text-center max-w-xl mb-8"
      >
        Real-time market data, AI-powered insights, and simulated trading — all
        in one place.
      </motion.p>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/login")}>Login</Button>
        <Button variant={"outline"} onClick={() => router.push("/register")}>
          Get Started
        </Button>
      </div>
      <button
        onClick={handleDashboard}
        className="bg-green-600 px-6 py-2 rounded-xl font-medium hover:bg-green-500 transition"
      >
        Dashboard
      </button>
    </div>
    //graph image or something of sorts
  );
};

export default HomePage;

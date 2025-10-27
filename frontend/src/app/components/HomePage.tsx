"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AnimatedGraph from "../animations/graph";

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
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-purple-700/20 to-black blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative py-6 px-4">
        {/* Heading centered */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center"
        >
          Welcome to <span className="text-blue-400">StockPulse</span>
        </motion.h1>

        {/* Buttons absolutely positioned to the right */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-4">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button variant="outline" onClick={() => router.push("/register")}>
            Get Started
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-gray-300 text-lg text-center max-w-xl mb-8"
        >
          Real-time market data, AI-powered insights, and simulated trading —
          all in one place.
        </motion.p>
      </div>
      <div className="flex justify-center py-10">
        <AnimatedGraph />
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDashboard}
          className="bg-green-600 px-6 py-2 rounded-xl font-medium hover:bg-green-500 transition"
        >
          Dashboard
        </button>
      </div>
    </div>
    //graph image or something of sorts
  );
};

export default HomePage;

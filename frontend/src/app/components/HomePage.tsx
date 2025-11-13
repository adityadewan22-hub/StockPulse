"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AnimatedGraph from "../animations/graph";
import { TrendingUp, BarChart3, Wallet, Brain } from "lucide-react";

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

  const features = [
    {
      icon: <TrendingUp className="w-10 h-10 text-blue-400 mb-4" />,
      title: "See Live Stock Prices",
      desc: "Stay updated with real-time market data and track every stock movement instantly.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-purple-400 mb-4" />,
      title: "Buy & Sell Stocks in Real Time",
      desc: "Execute trades seamlessly in our simulated environment and test your strategies.",
    },
    {
      icon: <Wallet className="w-10 h-10 text-green-400 mb-4" />,
      title: "Get Your Own Simulated Portfolio",
      desc: "Build and manage a virtual portfolio to practice without financial risk.",
    },
    {
      icon: <Brain className="w-10 h-10 text-yellow-400 mb-4" />,
      title: "Test Yourself against The Real Market",
      desc: "Leverage data-driven insights and analytics to make smarter trading decisions.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-purple-700/20 to-black blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative py-12 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold text-center tracking-tight"
        >
          Welcome to <span className="text-blue-400">StockPulse</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-400 text-lg text-center mt-4 max-w-2xl mx-auto"
        >
          Real-time market data, AI-powered insights, and simulated trading —
          all in one dashboard.
        </motion.p>
        <div className="absolute right-8 top-10 flex space-x-4">
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-700/30"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="border border-blue-500 text-blue-400 hover:bg-blue-500/10"
            onClick={() => router.push("/register")}
          >
            Get Started
          </Button>
        </div>
      </div>
      <div className="relative flex justify-center px-80 py-20">
        <div className="absolute  w-full h-3/4 bg-gradient-to-tr from-blue-700/20 via-purple-600/20 to-transparent blur-3xl rounded-full"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative w-[90%] md:w-[70%]"
        >
          <AnimatedGraph />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6 text-center shadow-lg shadow-black/30 hover:shadow-blue-800/30 hover:scale-[1.03] transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              {f.icon}
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Button
          onClick={handleDashboard}
          className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 text-lg rounded-xl font-semibold shadow-md shadow-green-700/30 transition-all duration-300"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default HomePage;

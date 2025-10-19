import StockCard from "./components/StockCard";
import StockList from "./components/StockList";
import StockLiveCard from "./components/StockLiveCard";
import ProtectRoute from "./routes/protectRoute";

export default function Home() {
  return (
    <ProtectRoute>
      <div className="background-div min-h-screen flex flex-col items-center justify-center">
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            📊 StockPulse Live
          </h1>
          <StockList />
        </main>
      </div>
    </ProtectRoute>
  );
}

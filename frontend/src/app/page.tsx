import StockCard from "./components/StockCard";
import StockLiveCard from "./components/StockLiveCard";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">📊 StockPulse Live</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockLiveCard symbol="AAPL" />
        <StockLiveCard symbol="MSFT" />
        <StockLiveCard symbol="GOOGL" />
      </div>
    </main>
  );
}

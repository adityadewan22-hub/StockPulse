import StockCard from "./components/StockCard";

export default function page() {
  return (
    <main>
      <h1>Stockpulse</h1>
      <StockCard symbol="AAPL" />;
    </main>
  );
}

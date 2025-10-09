"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const StockCard = ({ symbol }: { symbol: string }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
      setData(res.data);
    };
    fetchData();
  }, [symbol]);

  return (
    <div>
      <h2>
        {symbol}
        <pre>
          {JSON.stringify(
            data?.["Time Series (5min)"]?.[
              Object.keys(data?.["Time Series (5min)"] || {})[0]
            ],
            null,
            2
          )}
        </pre>
      </h2>
    </div>
  );
};

export default StockCard;

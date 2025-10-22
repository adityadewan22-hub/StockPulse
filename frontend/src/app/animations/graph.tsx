"use client";
import { useEffect, useState } from "react";
import { LineChart, XAxis, YAxis, Line } from "recharts";

const AnimatedGraph = () => {
  const [data, setData] = useState([{ time: 0, value: 100 }]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [
        ...prev.slice(-55),
        {
          time: prev.length,
          value: (prev[prev.length - 1].value * 2 + Math.random() * 5 - 1) / 2,
        },
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis
        dataKey="time"
        tick={false}
        label={{ value: "Time", position: "insideBottomRight", offset: -5 }}
      />
      <YAxis
        domain={["auto", "auto"]}
        tick={false}
        label={{ value: "Value", angle: -90, position: "insideLeft" }}
      />

      <Line
        type="monotone"
        dataKey="value"
        stroke="#00ff99"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  );
};

export default AnimatedGraph;

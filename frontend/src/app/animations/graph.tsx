"use client";
import { useEffect, useState } from "react";
import { LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";

const AnimatedGraph = () => {
  const [data, setData] = useState([{ time: 0, value: 100 }]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [
        ...prev.slice(-20),
        {
          time: prev.length,
          value: prev[prev.length - 1].value + Math.random() * 5 - 2,
        },
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="time" hide />
      <YAxis hide domain={["auto", "auto"]} />
      <Tooltip />
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

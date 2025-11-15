import { useState, useEffect } from "react";
import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";

type Share = {
  symbol: string;
  investmentPerStock: number;
};
type Prop = {
  shares: Share[];
};
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const Chart1 = ({ shares }: Prop) => {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={shares}
        dataKey="investmentPerStock"
        nameKey="symbol"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {shares.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

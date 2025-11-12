"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  mcap: string;
  btn?: React.ReactNode;
};

interface PopularTableProps {
  title?: string;
  holdings: Stock[];
}

export const PopularTable = ({
  title = "Popular Stocks",
  holdings,
}: PopularTableProps) => {
  return (
    <section className="w-full">
      <h2 className="text-xl text-gray-500 font-semibold mb-3">{title}</h2>
      <div className="bg-neutral-800 rounded border border-neutral-700 p-4 text-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-500">Symbol</TableHead>

              <TableHead className="text-right text-gray-500">Price</TableHead>
              <TableHead className="text-right text-gray-500">Change</TableHead>
              <TableHead className="text-right text-gray-500">Volume</TableHead>
              <TableHead className="text-right text-gray-500">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {holdings.map((p) => (
              <TableRow key={p.symbol}>
                <TableCell className="font-medium text-gray-400">
                  {p.symbol}
                </TableCell>

                <TableCell className="text-right text-gray-400">
                  ${p.price}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    p.change >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {p.change >= 0
                    ? `▲ ${p.change}%`
                    : `▼ ${Math.abs(p.change)}%`}
                </TableCell>
                <TableCell className="text-right">{p.volume}</TableCell>

                <TableCell className="text-right">{p.btn || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

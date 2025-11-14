import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { ReactElement } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/authContext";
import { Button } from "./button";

type Holding = {
  symbol: string;
  quantity: number;
  buyPrice: number;
  livePrice: number;
  btn: ReactElement;
};

type Props = {
  holdings: Holding[];
  totalValue: number;
};

export function HoldingsTable({ holdings, totalValue }: Props) {
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Live Price</TableHead>
            <TableHead>Profit / Loss</TableHead>
            <TableHead>Sell</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((stock) => {
            const profit = (stock.livePrice - stock.buyPrice) * stock.quantity;
            return (
              <TableRow key={stock.symbol}>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>${stock.buyPrice}</TableCell>
                <TableCell>${stock.livePrice}</TableCell>
                <TableCell
                  className={` font-semibold ${
                    profit >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ${Number(profit).toFixed(2)}
                </TableCell>
                <TableCell>{stock.btn}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className=" font-semibold">
              Total Portfolio Value
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="font-bold">${totalValue}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

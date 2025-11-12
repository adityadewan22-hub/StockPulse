import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React, { ReactElement } from "react";

type DashboardCardProps = {
  title: string;
  value: string | React.ReactNode | ReactElement;
  subtitle?: string;
  footer?: React.ReactNode;
};

export function DashboardCard({
  title,
  value,
  subtitle,
  footer,
}: DashboardCardProps) {
  return (
    <Card style={{ backgroundColor: "#0a0102ff" }} className="text-white">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-gray-500 flex justify-center ">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-gray-400 flex justify-center">
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent className=" flex justify-center">
        {typeof value === "string" || typeof value === "number" ? (
          <p className="text-2xl font-bold leading-tight">{value}</p>
        ) : (
          value
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

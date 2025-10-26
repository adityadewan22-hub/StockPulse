import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type DashboardCardProps = {
  title: string;
  value: string | React.ReactNode;
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
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-gray-500 ">
          {title}
        </CardTitle>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </CardHeader>
      <CardContent>
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

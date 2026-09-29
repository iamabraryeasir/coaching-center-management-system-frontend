"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboardMonthlySummary } from "@/hooks";

const chartConfig: ChartConfig = {
  paid: { label: "Paid", color: "var(--color-chart-2)" },
  partial: { label: "Partial", color: "var(--color-chart-3)" },
  unpaid: { label: "Unpaid", color: "var(--color-chart-5)" },
};

export function CollectionDonutChart() {
  const { data: monthly } = useDashboardMonthlySummary();
  const { financial, billingPeriodText } = monthly;

  const pieData = [
    {
      name: "Paid",
      value: financial.paidCount,
      color: "var(--color-chart-2)",
      key: "paid",
    },
    {
      name: "Partial",
      value: financial.partialCount,
      color: "var(--color-chart-3)",
      key: "partial",
    },
    {
      name: "Unpaid",
      value: financial.unpaidCount,
      color: "var(--color-chart-5)",
      key: "unpaid",
    },
  ];

  const total =
    financial.paidCount + financial.partialCount + financial.unpaidCount;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Fee Collection Status</CardTitle>
        <CardDescription>{billingPeriodText}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[200px]"
          initialDimension={{ width: 200, height: 200 }}
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">{name}:</span>
                      <span className="font-mono font-medium text-foreground">
                        {typeof value === "number" ? value : String(value)}{" "}
                        students
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              strokeWidth={2}
            >
              {pieData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Collection rate label */}
        <p className="text-center text-sm font-semibold text-foreground -mt-4 mb-4">
          {financial.collectionRate.toFixed(1)}% collected
        </p>

        {/* Legend */}
        <div className="space-y-2">
          {pieData.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-semibold tabular-nums text-foreground">
                {item.value}{" "}
                <span className="font-normal text-muted-foreground">
                  ({total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

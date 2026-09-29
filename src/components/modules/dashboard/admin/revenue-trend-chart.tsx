"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboardRevenueTrend } from "@/hooks";

const chartConfig: ChartConfig = {
  collectedAmount: { label: "Collected", color: "var(--color-chart-2)" },
  totalDue: { label: "Outstanding", color: "var(--color-chart-4)" },
};

export function RevenueTrendChart() {
  const { data } = useDashboardRevenueTrend(6);
  const trendData = data.trend;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>
          Collected vs outstanding dues — last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[280px] w-full"
          initialDimension={{ width: 600, height: 280 }}
        >
          <BarChart
            data={trendData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="monthYear"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: number) =>
                `৳${(value / 1000).toFixed(0)}k`
              }
              width={52}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ??
                          name}
                        :
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        ৳{" "}
                        {typeof value === "number"
                          ? value.toLocaleString()
                          : String(value)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="collectedAmount"
              fill="var(--color-collectedAmount)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
            <Bar
              dataKey="totalDue"
              fill="var(--color-totalDue)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

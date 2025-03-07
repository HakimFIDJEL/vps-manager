"use client";

// Necessay imports
import { useState, useEffect } from "react";
import Link from "next/link";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
// Icons
import { TrendingUp, MemoryStick, ArrowUpRight } from "lucide-react";

// Shadcn Components
import { Progress } from "@workspace/ui/components/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";

import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

const FETCH_INTERVAL = 20000; // 20 secondes

// Valeurs de test
const testData = [
  { time: "12:00:00", usage: 30 },
  { time: "12:00:05", usage: 45 },
  { time: "12:00:10", usage: 50 },
  { time: "12:00:15", usage: 60 },
  { time: "12:00:20", usage: 55 },
];

export function UsageRam() {
  const [chartData, setChartData] =
    useState<{ time: string; usage: number }[]>(testData);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      // try {
      //   // Simulation en attendant l'API
      //   const newData = {
      //     time: new Date().toLocaleTimeString(),
      //     usage: Math.floor(Math.random() * 100),
      //   }
      //   setChartData((prev) => [...prev.slice(-19), newData]) // Garde les 20 dernières entrées
      // } catch (error) {
      //   console.error("Error fetching RAM usage:", error)
      // }
    };

    fetchData();
    const interval = setInterval(fetchData, FETCH_INTERVAL);

    const progressInterval = setInterval(() => {
      setProgress((prev) =>
        prev > 0 ? prev - 100 / (FETCH_INTERVAL / 100) : 100
      );
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const chartConfig = {
    usage: {
      label: "RAM Usage (%)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MemoryStick />
            RAM Usage
          </span>

          <Link href="">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="h-7 w-7">
                  <ArrowUpRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>See details</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </CardTitle>
        <CardDescription>Real-time server RAM consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full flex justify-center"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 10, left: -25, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              domain={[0, 100]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillUsage" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-usage)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-usage)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="usage"
              type="natural"
              fill="url(#fillUsage)"
              fillOpacity={0.4}
              stroke="var(--color-usage)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        <Progress value={progress} />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Real-time tracking <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Updated every {FETCH_INTERVAL / 1000} seconds
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

"use client";

// Necessay imports
import { useState, useEffect } from "react";
import Link from "next/link";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
// Icons
import { TrendingUp, ArrowUpRight, Cpu } from "lucide-react";

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

import { Separator } from "@workspace/ui/components/separator";

const FETCH_INTERVAL = 20000; // 20 secondes

// Valeurs de test simulant l'utilisation du CPU
const testData = [
  { time: "12:00:00", usage: 15 },
  { time: "12:00:05", usage: 25 },
  { time: "12:00:10", usage: 40 },
  { time: "12:00:15", usage: 55 },
  { time: "12:00:20", usage: 65 },
];

export function UsageCpu({ className }: { className?: string }) {
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
      //   };
      //   setChartData((prev) => [...prev.slice(-19), newData]); // Garde les 20 dernières entrées
      // } catch (error) {
      //   console.error("Error fetching CPU usage:", error);
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
      label: "CPU Usage (%)",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card className={className} gradient>
      <CardHeader className=" bg-muted/50 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            CPU Usage
          </CardTitle>
          <CardDescription>Real-time server CPU consumption</CardDescription>
        </div>

        <Link href="">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="h-8 w-8  md:h-7 md:w-7">
                <ArrowUpRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>See details</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      </CardHeader>

      <Separator className="md:mb-6 mb-2" />

      <CardContent className="p-2 md:p-6">
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
      </CardContent>

      <Separator className="md:mb-6 mb-2" />

      <CardFooter className="pt-2 md:pt-0">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2 w-full">
            <h3 className="flex items-center gap-2 font-medium leading-none">
              Real-time tracking <TrendingUp className="h-4 w-4" />
            </h3>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Updated every {FETCH_INTERVAL / 1000} seconds
            </div>
          </div>
        </div>
      </CardFooter>

      <Progress
        value={progress}
        className="rounded-none rounded-b-xl h-2 md:h-3"
      />
    </Card>
  );
}

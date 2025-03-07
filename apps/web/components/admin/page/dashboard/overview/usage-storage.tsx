"use client";
import { useState, useEffect } from "react";

import { Archive, ArrowUpRight, TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
} from "@workspace/ui/components/chart";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const FETCH_INTERVAL = 60000; // 60 secondes

export function UsageStorage() {
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
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Archive />
            Storage Usage
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
        <CardDescription>Real-time server storage capacity</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData.length > 0
                            ? chartData[0]?.visitors.toLocaleString()
                            : "0"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
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

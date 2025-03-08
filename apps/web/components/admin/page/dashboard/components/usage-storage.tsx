"use client";

// Necessary imports
import { useState, useEffect, useMemo } from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import Link from "next/link";

// Icons
import { Archive, ArrowUpRight, TrendingUp } from "lucide-react";

// Shadcn Components
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

// Constants
const testData = [{ storageUsed: 120, storageTotal: 500 }];
const FETCH_INTERVAL = 60000; // 60 secondes

export function UsageStorage() {
  const [progress, setProgress] = useState(100);
  const isMobile = useIsMobile();

  const [storageData, setStorageData] =
    useState<{ storageUsed: number; storageTotal: number }[]>(testData);

  const chartData = useMemo(
    () => [
      {
        storageUsed: storageData?.[0]?.storageUsed ?? 0,
        storageTotal: storageData?.[0]?.storageTotal ?? 1,

        fill: "hsl(var(--primary))",
      },
    ],
    []
  );

  const polarRadius = useMemo(() => {
    return [90, 80];
  }, [isMobile]); 

  const storageUsed = storageData?.[0]?.storageUsed ?? 0;
  const storageTotal = storageData?.[0]?.storageTotal ?? 1; // Évite la division par 0
  const storagePercentage = Math.round((storageUsed / storageTotal) * 100);

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
    storageAvailable: {
      label: "Storage Available",
    },
    storageUsed: {
      label: "Storage Used",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className=" bg-muted/50 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            Disk usage
          </CardTitle>
          <CardDescription>Real-time server storage capacity</CardDescription>
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

      <CardContent className="p-0 md:p-6">
        <ChartContainer config={chartConfig} className="mx-auto w-full">
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={360 * (storagePercentage / 100)}
            // innerRadius="84%"
            // outerRadius="124%"
            innerRadius={84}
            outerRadius={124}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background h-full"
              polarRadius={polarRadius}
            />
            <RadialBar dataKey="storageUsed" background cornerRadius={10} />
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
                          {storageUsed}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          / {storageTotal} GB
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
      </CardContent>

      <Separator className="md:mb-6 mb-2" />

      <CardFooter className="pt-2 md:pt-0">
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

      <Progress
        value={progress}
        className="rounded-none rounded-b-xl h-2 md:h-3"
      />
    </Card>
  );
}

"use client";

// Necessary imports
import React, { useState } from "react";

// Shadcn Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Widget } from "@workspace/ui/components/widget";

// Icons
import {
  Activity,
  Calendar,
  Clock,
  Loader2,
  Trash2,
  UserCircle,
  UserCog,
} from "lucide-react";

export function AccountStats() {

  // Example data - replace with actual data from your application
  const accountData = {
    lastLogin: "2025-03-20T14:30:00",
    creationDate: "2024-08-15T09:45:00",
    totalLogins: 42,
  };


  

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Card gradient>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Account stats
        </CardTitle>
        <CardDescription>Have a look at your account stats</CardDescription>
      </CardHeader>

      <Separator className="mb-6" />

      <CardContent className="grid gap-2">
        {/* Stats widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Widget
            icon={<Clock />}
            title="Last Login"
            description={formatDate(accountData.lastLogin)}
          />

          <Widget
            icon={<Calendar />}
            title="Creation Date"
            description={formatDate(accountData.creationDate)}
          />

          <Widget
            icon={<UserCircle />}
            title="Total Logins"
            description={accountData.totalLogins.toString()}
          />
        </div>

       
      </CardContent>
    </Card>
  );
}

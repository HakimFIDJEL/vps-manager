"use client";
// Necessary imports
import { Profile } from "@/components/admin/page/account/tabs/profile";
import { Password } from "@/components/admin/page/account/tabs/password";
import { ProfilePicture } from "@/components/admin/page/account/tabs/profile-picture";
import { AccountStats } from "@/components/admin/page/account/tabs/account-stats";

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

// Icons
import { Activity, Image, Lock, UserCircle } from "lucide-react";

export function Account() {
  return (
    <Tabs defaultValue="profile">
      <div className="flex flex-col md:flex-row gap-2 justify-between align-start">
        <Card className="h-max">


          <CardContent className="p-0 w-full flex overflow-x-auto">
            <TabsList className="flex flex-row md:flex-col gap-4 h-full md:w-max bg-muted/50 md:p-6 p-4  w-auto ">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 w-full justify-start py-2 px-4"
              >
                <UserCircle className="h-5 w-5" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center gap-2 w-full justify-start py-2 px-4"
              >
                <Lock className="h-5 w-5" />
                Password
              </TabsTrigger>
              <TabsTrigger
                value="profile-picture"
                className="flex items-center gap-2 w-full justify-start py-2 px-4"
              >
                <Image className="h-5 w-5" />
                Profile Picture
              </TabsTrigger>
              <TabsTrigger
                value="account-stats"
                className="flex items-center gap-2 w-full justify-start py-2 px-4"
              >
                <Activity className="h-5 w-5" />
                Account Stats
              </TabsTrigger>
            </TabsList>
          </CardContent>



        </Card>

        <div className="w-full">
          <TabsContent value="profile" className="mt-0">
            <Profile />
          </TabsContent>

          <TabsContent value="password" className="mt-0">
            <Password />
          </TabsContent>

          <TabsContent value="profile-picture" className="mt-0">
            <ProfilePicture />
          </TabsContent>

          <TabsContent value="account-stats" className="mt-0">
            <AccountStats />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

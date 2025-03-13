"use client";

// Necessary imports
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Shadcn Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { PasswordInput } from "@workspace/ui/components/passwordinput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Separator } from "@workspace/ui/components/separator";

// Icons
import { Edit, Loader2, UserCircle } from "lucide-react";

// Custom components
import { PasswordStrengthChecker } from "@/components/elements/password-strength-checker";

const PasswordFormSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

type PasswordFormValues = z.infer<typeof PasswordFormSchema>;

export function Password() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const passwordValue = form.watch("password");

  function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log(data);
    }, 1000);
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-primary" />
          Profile
        </CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>

      <Separator className="md:mb-6 mb-2" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-3 flex-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password confirmation</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator orientation="vertical" className="md:block hidden" />

                <PasswordStrengthChecker
                    password={passwordValue}
                    onPasswordChange={(password, isValid) => {
                    setPasswordValid(isValid);
                    }}
                    className="flex-1"
                />
            </div>
            <Button type="submit" disabled={isLoading || !passwordValid}>
              {isLoading ? "Saving..." : "Save changes"}
              {isLoading && <Loader2 className="animate-spin" />}
              {!isLoading && <Edit />}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

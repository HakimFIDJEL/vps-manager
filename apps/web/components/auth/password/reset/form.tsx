"use client";

// Necessary Imports
import * as z from "zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Shadcn COmponents
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { PasswordInput } from "@workspace/ui/components/passwordinput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

// Icons
import { Loader2, RotateCcw, X } from "lucide-react";
import Link from "next/link";

// Custom components
import { PasswordStrengthChecker } from "@/components/elements/password-strength-checker"

const ResetFormSchema = z
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

type ResetFormValues = z.infer<typeof ResetFormSchema>;



export function ResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const passwordValue = form.watch("password");

  function onSubmit(data: ResetFormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log(data);
    }, 1000);
  }

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>
            Enter your new password to have access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
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

                  <PasswordStrengthChecker
                    password={passwordValue}
                    onPasswordChange={(password, isValid) => {
                      setPasswordValid(isValid)
                    }}
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

               
                <Button type="submit" className="w-full" disabled={isLoading || !passwordValid}>
                  Reset password
                  {isLoading ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>

              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Go back to login
                </Button>
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

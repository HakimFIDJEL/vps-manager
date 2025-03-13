"use client";

// Necessary imports
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Shadcn Components
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
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
import { Loader2, SendHorizonal } from "lucide-react";
import Link from "next/link";

const ForgetFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ForgetFormValues = z.infer<typeof ForgetFormSchema>;

export function ForgetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: Partial<ForgetFormValues> = {
    email: "",
  };

  const form = useForm<ForgetFormValues>({
    resolver: zodResolver(ForgetFormSchema),
    defaultValues,
  });

  function onSubmit(data: ForgetFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      //   toast({
      //     title: "Profile updated",
      //     description: "Your profile information has been updated successfully.",
      //   })
      console.log(data);
    }, 1000);
  }

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Password forgotten</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Send reset link
                  {isLoading && <Loader2 className="animate-spin" />}
                  {!isLoading && <SendHorizonal />}
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

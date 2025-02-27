"use client";

// Components
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Progress } from "@workspace/ui/components/progress";
import { PasswordInput } from "@workspace/ui/components/passwordinput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

// Icons
import { Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";

// Hooks
import { useState } from "react";

export function ResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [progress, setProgress] = useState(0);

  function onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = event.target.value;
    setPassword(newPassword);

    if (newPassword === "") {
      setIsPasswordValid(false);
      setProgress(0);
    } else {
      const strength = calculatePasswordStrength(newPassword);
      setIsPasswordValid(strength === 100);
      setProgress(strength);
    }
  }

  function onChangeConfirmation(event: React.ChangeEvent<HTMLInputElement>) {
    const newConfirmation = event.target.value;
    setConfirmation(newConfirmation);

    if (newConfirmation === "" || password === "") {
      setIsMatching(true);
    } else {
      setIsMatching(newConfirmation === password);
    }
  }

  function validatePassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  // Calculate the password strength
  function calculatePasswordStrength(password: string) {
    let score = 0;

    if (password.length >= 8) score += 30;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[\W_]/.test(password)) score += 10; // Caractère spécial

    return Math.min(score, 100);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>
            Enter your new password to have access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New password</Label>
                    <PasswordInput
                      id="password"
                      name="password"
                      required
                      value={password}
                      onChange={onChangePassword}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">
                      Password confirmation
                    </Label>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      required
                      value={confirmation}
                      onChange={onChangeConfirmation}
                      className={isMatching ? "" : "border-red-500"}
                    />
                  </div>

                  {/* Security rules for the password */}
                  {!isPasswordValid && password.length > 0 && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Your password must contain:
                      </p>
                      <ul className="text-sm text-muted-foreground">
                        <li className="flex items-center">
                          - At least 8 characters
                        </li>
                        <li className="flex items-center">
                          - One uppercase letter
                        </li>
                        <li className="flex items-center">- One number</li>
                      </ul>
                    </>
                  )}
                </div>
                {progress > 0 && (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password strength</Label>
                    <Progress value={progress} />
                  </div>
                  
                )}
                <Button type="submit" className="w-full">
                  Reset password
                  {loading && <Loader2 className="animate-spin" />}
                  {!loading && <RotateCcw />}
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

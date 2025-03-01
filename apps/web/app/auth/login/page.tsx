"use strict";

// Import the necessary libraries
import { LoginForm } from "@/components/auth/login/form"
import { Logo } from "@/components/elements/logo";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-muted md:bg-background">


      <div className="relative hidden bg-muted lg:block">
        <img
          src="/img/placeholder.svg"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>


      <div className="flex flex-col gap-4 p-6 md:p-6">


        <div className="flex gap-2 justify-start">
          <Logo />
        </div>


        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>


    </div>
  )
}

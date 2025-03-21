"use strict";

// Import the necessary libraries
import { ForgetForm } from "@/components/auth/password/forget/form";
import { Logo } from "@/components/elements/logo";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Forget Password",
}

export default function ForgetPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo className="fixed top-6 left-6" />

        <ForgetForm />
      </div>
    </div>
  );
}

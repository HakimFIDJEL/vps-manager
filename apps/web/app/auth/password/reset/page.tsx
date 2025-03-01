"use strict";

// Import the necessary libraries
import { ResetForm } from "@/components/auth/password/reset/form";
import { Logo } from "@/components/elements/logo";

export default function ResetPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo className="fixed top-6 left-6" />

        <ResetForm />
      </div>
    </div>
  );
}

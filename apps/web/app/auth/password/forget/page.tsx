"use strict";

// Import the necessary libraries
import { ForgetForm } from "@/components/auth/password/forget/form";

export default function ForgetPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 font-medium mb-3 fixed top-4 left-4"
        >
          <div className=" rounded-md bg-primary text-primary-foreground italic text-center h-6 w-6 flex items-center justify-center pr-0.5">
            H
          </div>
          Hakim Fidjel
        </a>

        <ForgetForm />
      </div>
    </div>
  );
}

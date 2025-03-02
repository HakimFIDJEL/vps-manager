import Link from "next/link";
import clsx from "clsx"; // Pour gérer les classes dynamiquement
import { cn } from "@workspace/ui/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  logo_size?: "5" | "8" | "10" | "12"; // Tailles autorisées
  font_size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, href, logo_size = "5", font_size = "sm" }: LogoProps) {
  return (
    <Link
      href={href || "#"}
      className={clsx("flex items-center gap-2 font-medium", className)}
    >
      <div
        className={cn(
          "rounded-md bg-primary text-primary-foreground italic text-center flex items-center justify-center pr-0.5",
          `h-${logo_size}`,
          `w-${logo_size}`,
          `text-${font_size}`
        )}
      >
        H
      </div>
      <div className={`text-${font_size}`}>Hakim Fidjel</div>
    </Link>
  );
}

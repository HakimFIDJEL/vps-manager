import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
  logo_size?: string;
  font_size?: string;
}

export function Logo({ className, href, logo_size, font_size }: LogoProps) {
  return (
    <Link
      href={href || "#"}
      className={`flex items-center gap-2 font-medium ${className} `}
    >
      <div
        className={`rounded-md bg-primary text-primary-foreground italic text-center h-${logo_size || "6"} w-${logo_size || "6"} text-${font_size || "sm"} flex items-center justify-center pr-0.5 aspect-square`}
      >
        H
      </div>
      <div className={`text-${font_size || "sm"}`}>Hakim Fidjel</div>
    </Link>
  );
}

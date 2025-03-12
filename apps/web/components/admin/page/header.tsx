import { Separator } from "@workspace/ui/components/separator";
import type React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  children,
  icon,
  ...props
}: HeaderProps) {
  return (
    <section
      className=" rounded-xl shadow-sm border border-sidebar-border 
             bg-background flex justify-between items-center flex-col md:flex-row"
      {...props}
    >
      <div
        className={`flex flex-col flex-1 items-center md:flex-row md:justify-between mx-auto px-6 py-4 h-full md:gap-2 gap-4 ${children ?? 'border-b md:border-b-0 md:border-r border-border'} w-full md:w-auto  bg-muted/50`}>
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h1 className="text-xl tracking-tight font-semibold">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {children && (
      <div className="gap-2 px-6 py-4 flex items-center">{children}</div>
      )}

    </section>
  );
}

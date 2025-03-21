import React from "react";

interface WidgetProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  gradient?: boolean;
}

export function Widget({ icon, title, description, gradient }: WidgetProps) {
  return (
    <div className="rounded-xl border bg-background text-foreground shadow-sm relative">
      {gradient && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary/15 via-background to-background rounded-xl"
          style={{
            "--tw-gradient-via-position": "20%",
            "--tw-gradient-to-position": "20%",
          } as React.CSSProperties}
        />
      )}
      <div className={gradient ? "relative z-10" : ""}>
        <div className="flex flex-col p-4 bg-muted/50 rounded-b-lg">
          <div className="flex items-center gap-2 mb-2">
            {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}
            <h3 className="font-medium text-sm text-primary">{title}</h3>
          </div>
          <p className="text-lg font-semibold">{description}</p>
        </div>
      </div>
    </div>
  )
  
}

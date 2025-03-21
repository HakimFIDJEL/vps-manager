import React from "react";

interface WidgetProps {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export function Widget({ icon, title, description }: WidgetProps) {
  return (
    <div className="flex flex-col p-4 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-2 mb-2">
        {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}

        <h3 className="font-medium text-sm text-primary">{title}</h3>
      </div>
      <p className="text-lg font-semibold">{description}</p>
    </div>
  );
}

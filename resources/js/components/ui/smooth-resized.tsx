import * as React from "react";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from '@formkit/auto-animate/react';

function SmoothResize({ ...props }: React.ComponentProps<"div">) {
  
  const [ref] = useAutoAnimate<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("relative", props.className)}
      {...props}
    />
  );
}


export {
  SmoothResize,
};
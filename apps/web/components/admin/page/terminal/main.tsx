"use client";

import React, { useEffect, useRef, useState } from "react";
import { createTerminal } from "@/lib/page/terminal";
import { useLoader } from "@/lib/loader";



export function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { showLoader, hideLoader } = useLoader();

 
  

  useEffect(() => {
    if (!terminalRef.current) return;

    const { terminal, fitAddon } = createTerminal(terminalRef.current);

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      terminal.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full bg-black h-96 rounded-lg shadow-sm p-4 overflow-hidden">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
}

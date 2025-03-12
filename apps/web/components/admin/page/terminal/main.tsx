"use client";

import React, { useEffect, useRef, useState } from "react";
import { createTerminal } from "@/lib/page/terminal";
import { useLoader } from "@/lib/loader";
import {
  Clock,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { showLoader, hideLoader } = useLoader();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const [user, setUser] = useState("user");
  const [ip, setIp] = useState("192.168.0.0");

  useEffect(() => {
    if (!terminalRef.current) return;

    const { terminal, fitAddon } = createTerminal(terminalRef.current);

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    // Update time every minute
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 60000);

    // Set initial time
    setCurrentTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

    return () => {
      terminal.dispose();
      window.removeEventListener("resize", handleResize);
      clearInterval(timeInterval);
    };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="w-full mx-auto">
      <div
        className={`terminal-window bg-black rounded-lg shadow-xl overflow-hidden border border-border transition-all ${
          isFullscreen
            ? "fixed inset-0 z-50 m-0 rounded-none max-w-none"
            : "relative"
        }`}
      >
        {/* Terminal Header */}
        <div className="bg-background   border-b border-border">
          <div className="bg-muted/50 flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="default"
                onClick={toggleFullscreen}
                className="w-6 h-6"
              >
                {isFullscreen ? <Minimize /> : <Maximize />}
              </Button>
              <span className="text-sm ml-4 font-medium">
                Terminal — ssh {user ?? 'user'}@{ip ?? 'server'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-2 h-full">
          <div ref={terminalRef} className="w-full h-full" />
        </div>

     
      </div>

      {/* Terminal Description */}
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm max-w-2xl mx-auto">
        <p>
          This terminal provides direct access to interact with the server. Type{" "}
          <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">
            help
          </code>{" "}
          to see available commands.
        </p>
      </div>
    </div>
  );
}

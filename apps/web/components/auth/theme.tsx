"use client";

// Components
import { Button } from "@workspace/ui/components/button";

// Icons
import { Sun, Moon } from "lucide-react";

// Hooks
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function Theme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Évite le flash d'erreur avant l'hydratation
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-foreground fixed top-4 right-4 z-50"
    >
        {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}

    </Button>
  );
}

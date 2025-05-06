"use client"

import * as React from "react"
import { Eye, EyeOff } from 'lucide-react'

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean
  addonText?: string
  addonPosition?: "start" | "end"
  comment?: string | null
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, showPasswordToggle, addonText, addonPosition = "start", comment = null, readOnly, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    // Détermine le type d'input à afficher
    const inputType = type === "password" && showPassword ? "text" : type

    // Ignore le toggle si le type n'est pas password ou text
    const shouldShowToggle = showPasswordToggle && (type === "password" || type === "text")

    // Style commun pour disabled et readonly
    const disabledOrReadonlyStyle = "pointer-events-none cursor-not-allowed opacity-50"

    // Styles pour l'input
    const inputStyles = cn(
      // Styles de base
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
      "dark:bg-input/30 bg-transparent text-base shadow-xs outline-none md:text-sm",
      "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "h-9 min-w-0 px-3 py-1 transition-[color,box-shadow]",

      // Styles conditionnels
      !addonText && "border-input border rounded-md w-full",
      addonText && "border-0 flex-1",
      shouldShowToggle && "pr-10",

      // États
      !readOnly && "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      readOnly && disabledOrReadonlyStyle,

      // Classes personnalisées
      className,
    )

    return (
      <div className="w-full">
        {/* Conteneur conditionnel pour les addons */}
        {addonText ? (
          <div
            className={cn(
              "flex items-center w-full rounded-md border border-input overflow-hidden",
              !readOnly && "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-[color,box-shadow]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              // readOnly && "opacity-50",
            )}
          >
            {/* Addon au début */}
            {addonPosition === "start" && (
              <div className="flex items-center justify-center px-3 h-9 bg-card text-muted-foreground border-r border-input">
                {addonText}
              </div>
            )}

            {/* Input */}
            <input
              type={inputType}
              data-slot="input"
              className={inputStyles}
              readOnly={readOnly}
              tabIndex={readOnly ? -1 : undefined}
              ref={ref}
              {...props}
            />

            {/* Addon à la fin */}
            {addonPosition === "end" && (
              <div className="flex items-center justify-center px-3 h-9 bg-card text-muted-foreground border-l border-input">
                {addonText}
              </div>
            )}

            {/* Toggle de mot de passe */}
            {shouldShowToggle && (
              <button
                type="button"
                className={cn(
                  "absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none",
                  readOnly && "opacity-50 pointer-events-none",
                )}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                disabled={readOnly}
                tabIndex={readOnly ? -1 : undefined}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            {/* Input simple sans addon */}
            <input
              type={inputType}
              data-slot="input"
              className={inputStyles}
              readOnly={readOnly}
              tabIndex={readOnly ? -1 : undefined}
              ref={ref}
              {...props}
            />

            {/* Toggle de mot de passe */}
            {shouldShowToggle && (
              <button
                type="button"
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none",
                  readOnly && "opacity-50 pointer-events-none",
                )}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                disabled={readOnly}
                tabIndex={readOnly ? -1 : undefined}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        )}

        {/* Commentaire */}
        {comment && <p className="text-xs text-muted-foreground mt-1 font-light">{comment}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }


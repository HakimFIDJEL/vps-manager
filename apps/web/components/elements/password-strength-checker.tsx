"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { Progress } from "@workspace/ui/components/progress"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { Separator } from "@workspace/ui/components/separator"

interface PasswordRequirement {
  id: string
  label: string
  validator: (password: string) => boolean
  met: boolean
}

interface PasswordStrengthCheckerProps {
  password: string
  onPasswordChange?: (password: string, isValid: boolean, strength: number) => void
  className?: string
}

export function PasswordStrengthChecker({
  password,
  onPasswordChange,
  className,
}: PasswordStrengthCheckerProps) {
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    {
      id: "length",
      label: "At least 8 characters",
      validator: (password) => password.length >= 8,
      met: false,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      validator: (password) => /[A-Z]/.test(password),
      met: false,
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      validator: (password) => /[a-z]/.test(password),
      met: false,
    },
    {
      id: "number",
      label: "One number",
      validator: (password) => /\d/.test(password),
      met: false,
    },
    {
      id: "special",
      label: "One special character",
      validator: (password) => /[\W_]/.test(password),
      met: false,
    },
  ])

  const [strength, setStrength] = useState(0)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Calculate which requirements are met based on the current password
    const updatedRequirements = requirements.map((req) => ({
      ...req,
      met: req.validator(password),
    }))

    setRequirements(updatedRequirements)

    // Calculate password strength
    let score = 0
    if (password.length >= 8) score += 20 // 8 characters
    if (/[A-Z]/.test(password)) score += 20 // Uppercase
    if (/[a-z]/.test(password)) score += 20 // Lowercase
    if (/\d/.test(password)) score += 20 // Number
    if (/[\W_]/.test(password)) score += 20 // Special character

    const finalScore = Math.min(score, 100)
    setStrength(finalScore)

    // Check if all requirements are met
    const allRequirementsMet = updatedRequirements.every((req) => req.met)
    setIsValid(allRequirementsMet)

    // Call the callback if provided
    if (onPasswordChange) {
      onPasswordChange(password, allRequirementsMet, finalScore)
    }
    // Only depend on password and onPasswordChange, not on requirements
  }, [password, onPasswordChange])

  return (
    <div className={cn("space-y-3", className)}>

      <Label>
        Requirements
        <Separator className="mt-2" />
      </Label>
      
        <div className="space-y-2">
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req.id}
                className={cn(
                  "flex items-center gap-2 text-sm transition-all duration-300",
                  req.met ? "text-primary line-through opacity-70" : "text-muted-foreground",
                )}
              >
                <span className="flex h-4 w-4 items-center justify-center">
                  {req.met ? (
                    <Check className="h-4 w-4 animate-in fade-in-50 zoom-in-50 duration-300" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </span>
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      

        <div className="space-y-2">
          <Label htmlFor="password-strength">Password strength</Label>
          <Progress
            id="password-strength"
            value={strength}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Weak</span>
            <span>Strong</span>
          </div>
        </div>
    </div>
  )
}


import React from "react"

type ButtonVariant = "primary" | "secondary" | "outline"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  variant?: ButtonVariant
  className?: string
  fullWidth?: boolean
}

// Not a great component but ok for this
export function BasicButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseClasses = "px-6 py-3 font-medium rounded-lg transition-colors"
  const widthClass = fullWidth ? "w-full" : ""
  
  const variantClasses = {
    primary: `text-white ${
      disabled ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
    }`,
    secondary: `text-white ${
      disabled ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
    }`,
    outline: `border ${
      disabled
        ? "border-gray-300 text-gray-400 cursor-not-allowed"
        : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
    }`,
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  )
}

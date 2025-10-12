import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface SheetTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
}

interface SheetHeaderProps {
  children: React.ReactNode
  className?: string
}

interface SheetTitleProps {
  children: React.ReactNode
  className?: string
}

const Sheet = ({ children, open, onOpenChange }: SheetProps) => {
  return (
    <div className="sheet-container">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { open, onOpenChange })
        }
        return child
      })}
    </div>
  )
}

const SheetTrigger = ({ children, asChild }: SheetTriggerProps) => {
  return <>{children}</>
}

const SheetContent = ({ children, className }: SheetContentProps) => {
  return (
    <div className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}>
      <div className="fixed inset-y-0 right-0 h-full w-3/4 border-l bg-background p-6 shadow-lg sm:max-w-sm">
        {children}
      </div>
    </div>
  )
}

const SheetHeader = ({ children, className }: SheetHeaderProps) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  )
}

const SheetTitle = ({ children, className }: SheetTitleProps) => {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
}

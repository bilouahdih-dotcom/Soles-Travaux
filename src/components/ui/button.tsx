import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-sm font-semibold uppercase tracking-[0.12em] transition-[transform,background-color,color,border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#c5a059] text-[#0a0a09] hover:-translate-y-0.5 hover:bg-[#dfbd77] hover:shadow-[0_14px_34px_rgba(197,160,89,.22)]",
        outline: "border border-current bg-transparent text-current hover:-translate-y-0.5 hover:bg-white hover:text-[#171713]",
        ghost: "bg-transparent text-current hover:bg-white/10",
        light: "bg-[#eef0ed] text-[#0a0a09] hover:-translate-y-0.5 hover:bg-white",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-7 md:h-16 md:px-9",
        icon: "size-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }

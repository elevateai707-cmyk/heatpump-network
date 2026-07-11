/**
 * shadcn/ui Button component
 * Variants: default, primary, outline, ghost, link, danger
 * Sizes: default, sm, lg, icon
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-light shadow-sm",
        destructive: "bg-danger text-white hover:bg-danger/90 shadow-sm",
        outline:
          "border border-border bg-white hover:bg-surface-muted text-text",
        secondary:
          "bg-secondary text-white hover:bg-secondary-light shadow-sm",
        ghost: "hover:bg-surface-muted text-text",
        link: "text-primary underline-offset-4 hover:underline",
        sponsored:
          "bg-sponsored border-2 border-dashed border-warning text-text hover:bg-sponsored/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

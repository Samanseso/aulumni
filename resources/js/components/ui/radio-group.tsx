import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as React from "react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "size-[25px] cursor-pointer rounded-full bg-white border border-black outline-none",
        className
      )}
      {...props}
    />
  )
}

function RadioGroupIndicator({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Indicator>) {
  return (
    <RadioGroupPrimitive.Indicator
      data-slot="radio-group-indicator"
      className={cn(
        "relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-blue",
        className
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupIndicator }

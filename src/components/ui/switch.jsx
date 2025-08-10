import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5 w-9 items-center rounded-full border border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        "bg-gray-300 dark:bg-gray-600", // OFF state background
        "data-[state=checked]:bg-indigo-500 dark:data-[state=checked]:bg-indigo-400", // ON state background
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full bg-white dark:bg-gray-100 transition-transform",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-1"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

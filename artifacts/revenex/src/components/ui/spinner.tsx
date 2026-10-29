import { useHindiText as useSiteText } from "@/lib/hindi-text";
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const siteText = useSiteText();
  return (
    <Loader2Icon
      role="status"
      aria-label={siteText("Loading")}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }

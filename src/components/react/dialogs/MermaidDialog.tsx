import React, { useLayoutEffect, useRef } from "react"
import { SurfaceDialogContent } from "@/components/ui/surface"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function MermaidDialog({
  svgString,
  close,
}: {
  svgString: string
  close: () => void
}) {
  return (
    <SurfaceDialogContent
      className="w-[90vw] max-w-[90vw] sm:w-[80vw] sm:max-w-[80vw] h-[80vh] max-h-[80vh] overflow-hidden flex flex-col p-6 sm:p-10 bg-[var(--card-bg)] border-[var(--line-divider)] rounded-[var(--radius-large)]"
      onPointerDownOutside={() => close()}
    >
      <DialogHeader className="sr-only">
        <DialogTitle>Mermaid Diagram Fullscreen View</DialogTitle>
      </DialogHeader>
      <div className="flex-1 w-full flex items-center justify-center overflow-auto">
        <div 
          className="mermaid-wrapper mermaid-dialog-content w-full h-full flex items-center justify-center min-h-[8rem] [&>svg]:w-full [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:max-h-full" 
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
      </div>
    </SurfaceDialogContent>
  )
}

"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Camera, FileDown } from "lucide-react"
import { useState } from "react"
import { ScreenshotSettings } from "./screenshot-settings"
import { TrafficExport } from "./traffic-export"

export function Header() {
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)

  return (
    <div className="w-full bg-white shadow-md p-2 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Управление дорожным движением</h1>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={isScreenshotOpen} onOpenChange={setIsScreenshotOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[360px] z-[2000]" align="end" sideOffset={5}>
            <ScreenshotSettings onClose={() => setIsScreenshotOpen(false)} />
          </PopoverContent>
        </Popover>

        <Popover open={isExportOpen} onOpenChange={setIsExportOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <FileDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] z-[2000]" align="end" sideOffset={5}>
            <TrafficExport onClose={() => setIsExportOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

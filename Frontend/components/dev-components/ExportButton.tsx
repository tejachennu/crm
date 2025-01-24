"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { generateSocialMediaReport } from "@/lib/excel-generator"
import type { FacebookPost, InstagramPost, IGReel, FBReel } from "@/types/fb"

type SocialMediaType = "facebook" | "instagram" | "igReels" | "fbReels"
type ReportType = "basic" | "detailed"

type SocialMediaDataType = {
  facebook: FacebookPost
  instagram: InstagramPost
  igReels: IGReel
  fbReels: FBReel
}

interface ExportButtonProps<T extends SocialMediaType> {
  data: SocialMediaDataType[T][]
  type: T
  reportType?: ReportType
  className?: string
}

export function ExportButton<T extends SocialMediaType>({
  data,
  type,
  reportType = "basic",
  className,
}: ExportButtonProps<T>) {
  const handleExport = () => {
    const blob = generateSocialMediaReport(data, type, reportType)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    const timestamp = new Date().toISOString().split("T")[0]

    a.href = url
    a.download = `${type}-report-${timestamp}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <Button variant="outline" className={className} onClick={handleExport}>
      <DownloadIcon className="w-4 h-4 mr-2" />
      Export {type.charAt(0).toUpperCase() + type.slice(1)} Report ({reportType})
    </Button>
  )
}


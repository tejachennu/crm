import React, { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DownloadIcon, Mail } from "lucide-react"
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

interface SendReportMailProps<T extends SocialMediaType> {
  data: SocialMediaDataType[T][]
  type: T
  reportType?: ReportType
  className?: string
}

export function SendReportMail<T extends SocialMediaType>({
  data,
  type,
  reportType = "basic",
  className,
}: SendReportMailProps<T>) {
  const [email, setEmail] = useState<string>("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSendReport = async () => {
    const blob = generateSocialMediaReport(data, type, reportType)

    // Create a FormData object to send the file and email
    const formData = new FormData()
    formData.append("file", blob, `${type}-report-${new Date().toISOString()}.xlsx`)
    formData.append("email", email)

    try {
      // Send POST request to backend API to send the report via email
      const response = await axios.post("https://api.aquarythu.com/api/send-report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Report sent successfully:", response.data)
    } catch (error) {
      console.error("Error sending report:", error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Mail className="w-4 h-4 mr-2" />
          Send Report by Email
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Report by Email</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the email address to which you'd like to send the report.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-4">
          <input
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={handleEmailChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSendReport}>Send Report</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

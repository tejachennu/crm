import type { FacebookPost, FBReel, IGReel, InstagramPost } from "@/types/fb"
import * as XLSX from "xlsx"

// Generic type for value transformation
type ValueTransformer<T> = (value: T) => string | number

// Interface for column configuration
export interface ColumnConfig<T> {
  header: string
  key: keyof T | string
  transform?: ValueTransformer<any>
}

// Helper functions for common transformations
export const transforms = {
  date:
    (
      format: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ) =>
    (date: any) => {
      return new Date(date.dateTime).toLocaleString(undefined, format)
    },
  number:
    (decimals = 0) =>
    (value: number) => {
      return typeof value === "number" ? value.toFixed(decimals) : "0"
    },
  percentage:
    (decimals = 2) =>
    (value: number) => {
      return `${(value * 100).toFixed(decimals)}%`
    },
  nested: (path: string[]) => (obj: any) => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj) || ""
  },
}

export function generateExcel<T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig<T>[],
  options: {
    sheetName?: string
    fileName?: string
  } = {},
) {
  const { sheetName = "Sheet1", fileName = "export.xlsx" } = options

  const transformedData = data.map((item) => {
    const row: Record<string, any> = {}
    columns.forEach(({ header, key, transform }) => {
      let value: any
      if (typeof key === "string" && key.includes(".")) {
        value = transforms.nested(key.split("."))(item)
      } else {
        value = item[key as keyof T]
      }
      row[header] = transform ? transform(value) : value
    })
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(transformedData)
  const columnWidths = columns.map(({ header }) => ({
    wch: Math.max(header.length, 10),
  }))
  worksheet["!cols"] = columnWidths

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}

export const columnConfigs = {
  facebook: {
    basic: [
      { header: "Post Content", key: "text" },
      { header: "Posted Date", key: "created", transform: transforms.date() },
      { header: "Impressions", key: "impressions", transform: transforms.number() },
      { header: "Engagement", key: "engagement", transform: transforms.percentage },
      { header: "Reactions", key: "reactions" },
      { header: "Comments", key: "comments" },
      { header: "Shares", key: "shares" },
    ],
    detailed: [
      { header: "Post ID", key: "postId" },
      { header: "Content", key: "text" },
      { header: "Posted Date", key: "created", transform: transforms.date() },
      { header: "Total Impressions", key: "impressions", transform: transforms.number() },
      { header: "Engagement Rate", key: "engagement", transform: transforms.percentage },
      { header: "Reactions", key: "reactions" },
      { header: "Comments", key: "comments" },
      { header: "Shares", key: "shares" },
    ],
  },
  instagram: {
    basic: [
      { header: "Content", key: "content" },
      { header: "Posted Date", key: "publishedAt", transform: transforms.date() },
      { header: "Impressions", key: "impressions", transform: transforms.number() },
      { header: "Engagement", key: "engagement", transform: transforms.percentage },
      { header: "Likes", key: "likes" },
      { header: "Comments", key: "comments" },
      { header: "Saved", key: "saved" },
    ],
    detailed: [
      { header: "Post ID", key: "postId" },
      { header: "Content", key: "content" },
      { header: "Posted Date", key: "publishedAt", transform: transforms.date() },
      { header: "Total Impressions", key: "impressions", transform: transforms.number() },
      { header: "Engagement Rate", key: "engagement", transform: transforms.percentage },
      { header: "Likes", key: "likes" },
      { header: "Comments", key: "comments" },
      { header: "Saved", key: "saved" },
    ],
  },
  igReels: {
    detailed: [
      { header: "Content", key: "content" },
      { header: "Posted Date", key: "publishedAt", transform: transforms.date() },
      { header: "Views", key: "videoViews", transform: transforms.number() },
      { header: "Engagement", key: "engagement", transform: transforms.percentage },
      { header: "Likes", key: "likes" },
      { header: "Comments", key: "comments" },
      { header: "Shares", key: "shares" },
    ],
  },
  fbReels: {
    detailed: [
      { header: "Description", key: "description" },
      { header: "Posted Date", key: "created", transform: transforms.date() },
      { header: "Play Count", key: "blueReelsPlayCount", transform: transforms.number() },
      { header: "Engagement", key: "engagement", transform: transforms.percentage },
      { header: "Comments", key: "comments" },
      { header: "Avg Watch Time (s)", key: "postVideoAvgTimeWatchedSeconds", transform: transforms.number(2) },
    ],
  },
}

type SocialMediaType = keyof typeof columnConfigs
type ReportType = "basic" | "detailed"
type SocialMediaDataType = {
  facebook: FacebookPost
  instagram: InstagramPost
  igReels: IGReel
  fbReels: FBReel
}

export function generateSocialMediaReport<T extends SocialMediaType>(
  data: SocialMediaDataType[T][],
  type: T,
  reportType: ReportType = "basic",
  customColumns?: ColumnConfig<SocialMediaDataType[T]>[],
) {
  const config = columnConfigs[type] as Record<ReportType, ColumnConfig<SocialMediaDataType[T]>[]>
  const columns = customColumns || config[reportType]
  const timestamp = new Date().toISOString().split("T")[0]

  return generateExcel(data, columns, {
    sheetName: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
    fileName: `${type}-report-${timestamp}.xlsx`,
  })
}


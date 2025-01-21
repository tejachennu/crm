import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table"
import { PlayCircle, Clock, Heart } from "lucide-react"

export function TableSkeleton() {
  // Create an array of 5 items for skeleton rows
  const skeletonRows = Array.from({ length: 5 })

  return (
    <div className="overflow-x-auto">
      <Table className=" rounded-lg border w-full bg-white border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-200">
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">                <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
            </TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">                <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
               <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
               <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 overflow-hidden bg-gray-200 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-32 h-2 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex justify-end">
                  <div className="w-16 h-2 bg-gray-200 rounded animate-pulse" />
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex justify-end">
                  <div className="w-12 h-2 bg-gray-200 rounded animate-pulse" />
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex justify-end">
                  <div className="w-14 h-2 bg-gray-200 rounded animate-pulse" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


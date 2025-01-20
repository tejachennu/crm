"use client"

import { useState } from "react"
import { FacebookPost } from "@/types/fb"
import { PostDetailsTable } from "./PostDetailsTable"
import { PostContent } from "./PostContent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChartNoAxesCombined, LayoutDashboard, Loader2 } from 'lucide-react'
import PostData from "../PostData"

interface FacebookPostDetailsProps {
  post: FacebookPost | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export function FacebookPostDetails({ post, isLoading, error, onClose }: FacebookPostDetailsProps) {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-[1000px] h-[90vh] max-h-[800px] p-0 bg-white">
        <DialogHeader className="px-6 pt-4 pb-2 bg-gray-100">
          <DialogTitle className="flex gap-2 text-2xl font-bold text-gray-800"><ChartNoAxesCombined className="text-blue-500 " size={24} />Analytical Post Reports</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] max-h-[700px]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {post && !isLoading && !error && (
            <div className="px-6 py-2">
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content"><LayoutDashboard size={12} className="mr-1 text-blue-600 " />Current Report</TabsTrigger>
                  <TabsTrigger value="metrics"><CalendarDays size={12} className="mr-1 text-blue-600 "/> 14 Days Metrics</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <PostContent post={post} />
                </TabsContent>
                <TabsContent value="metrics">
                  <PostData postId={post.postId}/>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </ScrollArea>
        <div className="p-6 border-t">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


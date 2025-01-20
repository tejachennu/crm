import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { InstagramPost } from "@/types/fb";
  import { Eye, Heart, MessageCircle, Bookmark, Play, Link } from 'lucide-react'
  
  interface InstagramPostDetailsTableProps {
    post: InstagramPost;
  }
  
  export function InstagramPostDetailsTable({ post }: InstagramPostDetailsTableProps) {
    const rows = [
      { icon: <Eye className="w-4 h-4 text-blue-500" />, label: "Impressions", value: post.impressions },
      { icon: <Eye className="w-4 h-4 text-cyan-500" />, label: "Reach", value: post.reach },
      { icon: <Heart className="w-4 h-4 text-red-500" />, label: "Likes", value: post.likes },
      { icon: <MessageCircle className="w-4 h-4 text-yellow-500" />, label: "Comments", value: post.comments },
      { icon: <Bookmark className="w-4 h-4 text-green-500" />, label: "Saved", value: post.saved },
      { icon: <Play className="w-4 h-4 text-purple-500" />, label: "Video Views", value: post.videoViews },
      { icon: <Eye className="w-4 h-4 text-indigo-500" />, label: "Total Impressions", value: post.impressionsTotal },
      { icon: <Play className="w-4 h-4 text-pink-500" />, label: "Total Video Views", value: post.videoViewsTotal },
    ]
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.icon}</TableCell>
              <TableCell>{row.label}</TableCell>
              <TableCell className="text-right">{row.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  
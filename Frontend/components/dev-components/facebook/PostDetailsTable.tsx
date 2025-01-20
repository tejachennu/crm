import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { FacebookPost } from "@/types/fb";
  import { Eye, TrendingUp, BarChart3, Heart, MessageCircle, Share2, Play, Clock, Link, DollarSign } from 'lucide-react'
  
  interface PostDetailsTableProps {
    post: FacebookPost;
  }
  
  export function PostDetailsTable({ post }: PostDetailsTableProps) {
    const rows = [
      { icon: <Eye className="w-4 h-4 text-blue-500" />, label: "Impressions", value: post.impressions },
      { icon: <TrendingUp className="w-4 h-4 text-green-500" />, label: "Organic Impressions", value: post.impressionsOrganic },
      { icon: <BarChart3 className="w-4 h-4 text-purple-500" />, label: "Paid Impressions", value: post.impressionsPaid },
      { icon: <Eye className="w-4 h-4 text-cyan-500" />, label: "Unique Impressions", value: post.impressionsUnique },
      { icon: <TrendingUp className="w-4 h-4 text-teal-500" />, label: "Unique Organic Impressions", value: post.impressionsUniqueOrganic },
      { icon: <BarChart3 className="w-4 h-4 text-indigo-500" />, label: "Unique Paid Impressions", value: post.impressionsUniquePaid },
      { icon: <Heart className="w-4 h-4 text-red-500" />, label: "Reactions", value: post.reactions },
      { icon: <MessageCircle className="w-4 h-4 text-yellow-500" />, label: "Comments", value: post.comments },
      { icon: <Share2 className="w-4 h-4 text-orange-500" />, label: "Shares", value: post.shares },
      { icon: <Play className="w-4 h-4 text-green-500" />, label: "Video Views", value: post.videoViews },
      { icon: <TrendingUp className="w-4 h-4 text-blue-500" />, label: "Organic Video Views", value: post.videoViewsOrganic },
      { icon: <BarChart3 className="w-4 h-4 text-purple-500" />, label: "Paid Video Views", value: post.videoViewsPaid },
      { icon: <Clock className="w-4 h-4 text-gray-500" />, label: "Video Time Watched", value: `${post.videoTimeWatched} seconds` },
      { icon: <Link className="w-4 h-4 text-blue-500" />, label: "Link Clicks", value: post.linkclicks },
      { icon: <DollarSign className="w-4 h-4 text-green-500" />, label: "Spend", value: `$${post.spend.toFixed(2)}` },
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
  
  
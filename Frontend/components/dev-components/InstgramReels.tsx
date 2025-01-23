// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   RefreshCwIcon,
//   Search,
//   ImageIcon,
//   Heart,
//   MessageCircle,
//   Share2,
//   Eye,
//   TrendingUp,
//   Bookmark,
// } from "lucide-react";

// import Image from "next/image";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Badge } from "../ui/badge";
// import { ScrollArea } from "../ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// interface IGReel {
//   reelId: string;
//   userId: string;
//   businessId: string;
//   type: string;
//   publishedAt: { dateTime: string; timezone: string };
//   filter: string;
//   url: string;
//   content: string;
//   imageUrl: string;
//   likes: number;
//   comments: number;
//   interactions: number;
//   engagement: number;
//   impressions: number;
//   reach: number;
//   saved: number;
//   shares: number;
//   videoViews: number;
//   impressionsTotal: number;
//   videoViewsTotal: number;
// }

// export default function InstagramReels() {
//   const [allReels, setAllReels] = useState<IGReel[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const reelsPerPage = 10;
//   const [blogId, setBlogId] = useState<string | null>(null);

//   useEffect(() => {
//     const blogid = localStorage.getItem("blogId");
//     setBlogId(blogid); // blogid is a string or null
//   }, []);



//   const headers = {
//     Accept: "application/json",
//     "X-Mc-Auth":
//       "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
//   };

//   useEffect(() => {
//     fetchReels();
//   }, []);

//   const fetchReels = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const formatDateTime = (date: Date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const day = String(date.getDate()).padStart(2, "0");
//         const hours = String(date.getHours()).padStart(2, "0");
//         const minutes = String(date.getMinutes()).padStart(2, "0");
//         const seconds = String(date.getSeconds()).padStart(2, "0");
//         return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//       };

//       const currentDate = new Date();
//       const fourYearsAgo = new Date();
//       fourYearsAgo.setFullYear(currentDate.getFullYear() - 4);

//       const from = formatDateTime(fourYearsAgo);
//       const to = formatDateTime(currentDate);

//       const response = await axios.get(
//         "https://app.metricool.com/api/v2/analytics/reels/instagram",
//         {
//           params: {
//             from,
//             to,
//             blogId
//           },
//           headers,
//         }
//       );

//       setAllReels(response.data.data);
//     } catch (err) {
//       setError("An error occurred while fetching reels");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Pagination logic
//   const indexOfLastReel = currentPage * reelsPerPage;
//   const indexOfFirstReel = indexOfLastReel - reelsPerPage;
//   const currentReels = allReels.slice(indexOfFirstReel, indexOfLastReel);
//   const totalPages = Math.ceil(allReels.length / reelsPerPage);

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   if (error) return <div className="text-red-500 text-center">{error}</div>;

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">List of Instagram Reels</h1>
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input placeholder="Search" className="pl-9 w-[280px]" />
//           </div>
//           <Button
//             variant="outline"
//             className="bg-blue-500 text-white"
//             size="sm"
//             onClick={fetchReels}
//           >
//             <RefreshCwIcon className="h-4 w-4 mr-2" />
//             Update Reels
//           </Button>
//         </div>
//       </div>

//       <Card className="rounded-lg border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b bg-gray-50">
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
//                   Thumbnail
//                 </th>
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
//                   Date
//                 </th>
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
//                   Likes
//                 </th>
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
//                   Comments
//                 </th>
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
//                   Shares
//                 </th>
//                 <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
//                   Video Views
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentReels.map((reel) => (
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <tr className="border-b hover:bg-gray-50 cursor-pointer">
//                       <td className="px-4 py-4 text-sm">
//                         <div className="flex items-center gap-3">
//                           <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
//                             {reel.imageUrl ? (
//                               <Image
//                                 src={reel.imageUrl || "/placeholder.svg"}
//                                 alt={reel.content || "Instagram post"}
//                                 fill
//                                 className="object-cover"
//                                 sizes="(max-width: 64px) 100vw, 64px"
//                               />
//                             ) : (
//                               <div className="w-full h-full flex items-center justify-center">
//                                 <ImageIcon className="w-6 h-6 text-gray-400" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="max-w-[200px] truncate">
//                             {reel.content}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-600">
//                         {new Date(reel.publishedAt.dateTime).toLocaleString()}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-center">
//                         {reel.likes.toLocaleString()}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-center">
//                         {reel.comments.toLocaleString()}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-center">
//                         {reel.shares.toLocaleString()}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-center">
//                         {reel.videoViews.toLocaleString()}
//                       </td>
//                     </tr>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-4xl w-full bg-white">
//                     <DialogHeader>
//                       <DialogTitle className="text-2xl font-bold text-gray-800">
//                         Reel Insights
//                       </DialogTitle>
//                     </DialogHeader>

//                     <div className="flex flex-col min-h-[80vh] overflow-hidden">
//                       <Tabs
//                         defaultValue="details"
//                         className="flex-grow overflow-hidden"
//                       >
//                         <TabsList className="px-6">
//                           <TabsTrigger value="details">
//                             Post Details
//                           </TabsTrigger>
//                           <TabsTrigger value="report">
//                             14 Days Report
//                           </TabsTrigger>
//                         </TabsList>
//                         <div className="flex-grow overflow-auto">
//                           <TabsContent value="details" className="h-full">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
//                               <div className="md:col-span-1">
//                                 <div className="relative w-full pt-[177.78%] rounded-lg overflow-hidden bg-gray-100 shadow-md">
//                                   {reel.imageUrl ? (
//                                     <Image
//                                       src={reel.imageUrl || "/placeholder.svg"}
//                                       alt="Reel Image"
//                                       fill
//                                       className="object-cover"
//                                       sizes="(max-width: 768px) 100vw, 33vw"
//                                     />
//                                   ) : (
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                       <ImageIcon className="w-16 h-16 text-gray-400" />
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="mt-4 space-y-2">
//                                   <p className="text-sm text-gray-500">
//                                     Published on{" "}
//                                     {new Date(
//                                       reel.publishedAt.dateTime
//                                     ).toLocaleDateString()}
//                                   </p>
//                                   <Badge
//                                     variant="secondary"
//                                     className="text-xs"
//                                   >
//                                     {(reel.engagement * 100).toFixed(2)}%
//                                     Engagement Rate
//                                   </Badge>
//                                 </div>
//                               </div>
//                               <div className="md:col-span-2">
//                                 <ScrollArea className="h-[500px] pr-4">
//                                   <div className="space-y-6">
//                                     <Card>
//                                       <CardContent className="p-4">
//                                         <h3 className="text-lg font-semibold mb-2">
//                                           Content
//                                         </h3>
//                                         <ScrollArea className="h-[100px]">
//                                           <p className="text-gray-700">
//                                             {reel.content}
//                                           </p>
//                                         </ScrollArea>
//                                       </CardContent>
//                                     </Card>
//                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                                       <Card>
//                                         <CardContent className="p-4 flex flex-col items-center justify-center">
//                                           <Heart className="w-6 h-6 text-red-500 mb-2" />
//                                           <p className="text-2xl font-bold">
//                                             {reel.likes.toLocaleString()}
//                                           </p>
//                                           <p className="text-sm text-gray-500">
//                                             Likes
//                                           </p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="p-4 flex flex-col items-center justify-center">
//                                           <MessageCircle className="w-6 h-6 text-blue-500 mb-2" />
//                                           <p className="text-2xl font-bold">
//                                             {reel.comments.toLocaleString()}
//                                           </p>
//                                           <p className="text-sm text-gray-500">
//                                             Comments
//                                           </p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="p-4 flex flex-col items-center justify-center">
//                                           <Share2 className="w-6 h-6 text-green-500 mb-2" />
//                                           <p className="text-2xl font-bold">
//                                             {reel.shares.toLocaleString()}
//                                           </p>
//                                           <p className="text-sm text-gray-500">
//                                             Shares
//                                           </p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="p-4 flex flex-col items-center justify-center">
//                                           <Eye className="w-6 h-6 text-purple-500 mb-2" />
//                                           <p className="text-2xl font-bold">
//                                             {reel.videoViews.toLocaleString()}
//                                           </p>
//                                           <p className="text-sm text-gray-500">
//                                             Views
//                                           </p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="p-4 flex flex-col items-center justify-center">
//                                           <TrendingUp className="w-6 h-6 text-yellow-500 mb-2" />
//                                           <p className="text-2xl font-bold">
//                                             {reel.reach.toLocaleString()}
//                                           </p>
//                                           <p className="text-sm text-gray-500">
//                                             Reach
//                                           </p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="p-4 flex flex-col items-center justify-center">
//                                           <Bookmark className="w-6 h-6 text-indigo-500 mb-2" />
//                                           <p className="text-2xl font-bold">
//                                             {reel.saved.toLocaleString()}
//                                           </p>
//                                           <p className="text-sm text-gray-500">
//                                             Saved
//                                           </p>
//                                         </CardContent>
//                                       </Card>
//                                     </div>
//                                   </div>
//                                 </ScrollArea>
//                               </div>
//                             </div>
//                           </TabsContent>
//                           <TabsContent value="report" className="h-full">
//                             <div className="p-6 h-full">
//                               <p className="text-gray-500">
//                                 14 Days Report data will be added here.
//                               </p>
//                             </div>
//                           </TabsContent>
//                         </div>
//                       </Tabs>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       <div className="flex justify-between items-center mt-4 px-4">
//         <div className="text-sm text-gray-500">
//           Showing {indexOfFirstReel + 1} to{" "}
//           {Math.min(indexOfLastReel, allReels.length)} of {allReels.length}{" "}
//           results
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             className="bg-blue-500 text-white"
//             size="sm"
//             onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             className="bg-blue-500 text-white"
//             onClick={() =>
//               setCurrentPage((page) => Math.min(totalPages, page + 1))
//             }
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  RefreshCw,
  Instagram,
  Eye,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  BarChart3,
  Bookmark,
  Play,
} from "lucide-react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableSkeleton } from "./TableSkeleton"
import InstagramReelData from "./instgram/InstagramReelData"

interface IGReel {
  reelId: string
  userId: string
  businessId: string
  type: string
  publishedAt: { dateTime: string; timezone: string }
  filter: string
  url: string
  content: string
  imageUrl: string
  likes: number
  comments: number
  interactions: number
  engagement: number
  impressions: number
  reach: number
  saved: number
  shares: number
  videoViews: number
  impressionsTotal: number
  videoViewsTotal: number
}

function ReelContent({ reel }: { reel: IGReel }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Reel Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-0 pb-[177.77%]">
            <Image
              src={reel.imageUrl || "/placeholder.svg"}
              alt="Instagram reel thumbnail"
              fill
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
          <p className="mt-4 text-sm text-gray-700">{reel.content}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reel Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="flex items-center">
                  <Play className="w-4 h-4 mr-2 text-blue-500" /> Video Views
                </TableCell>
                <TableCell className="text-center font-medium">{reel.videoViews.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-green-500" /> Impressions
                </TableCell>
                <TableCell className="text-center font-medium">{reel.impressions.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> Reach
                </TableCell>
                <TableCell className="text-center font-medium">{reel.reach.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" /> Likes
                </TableCell>
                <TableCell className="text-center font-medium">{reel.likes.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-cyan-500" /> Comments
                </TableCell>
                <TableCell className="text-center font-medium">{reel.comments.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2 text-indigo-500" /> Shares
                </TableCell>
                <TableCell className="text-center font-medium">{reel.shares.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Bookmark className="w-4 h-4 mr-2 text-yellow-500" /> Saved
                </TableCell>
                <TableCell className="text-center font-medium">{reel.saved.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-500" /> Engagement
                </TableCell>
                <TableCell className="text-center font-medium">{reel.engagement.toFixed(2)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ReelDetails({ reel, onClose }: { reel: IGReel; onClose: () => void }) {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-[1000px] h-[90vh] max-h-[800px] p-0 bg-white">
        <DialogHeader className="px-6 pt-4 pb-2 bg-gray-100">
          <DialogTitle className="flex gap-2 text-2xl font-bold text-gray-800">
            <Instagram className="text-blue-500" size={24} />
            Reel Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] max-h-[700px]">
          <div className="px-6 py-4">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Post Details</TabsTrigger>
                <TabsTrigger value="report">14 Days Report</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <ReelContent reel={reel} />
              </TabsContent>
              <TabsContent value="report">
                <InstagramReelData reelId={reel.reelId} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <div className="p-6 border-t">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function InstagramReels() {
  const [allReels, setAllReels] = useState<IGReel[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReel, setSelectedReel] = useState<IGReel | null>(null)
  const reelsPerPage = 10
  // const [blogId, setBlogId] = useState<string | null>(null)

  // useEffect(() => {
  //   const blogid = localStorage.getItem("blogId")
  //   setBlogId(blogid)
  // }, [])

  const headers = {
    Accept: "application/json",
    "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  }

  useEffect(() => {
    fetchReels()
  }, [])

  const fetchReels = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        const seconds = String(date.getSeconds()).padStart(2, "0")
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      }

      const currentDate = new Date()
      const threeYearsAgo = new Date()
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3)

      const from = formatDateTime(threeYearsAgo)
      const to = formatDateTime(currentDate)
      const blogId = localStorage.getItem("blogId");


      const response = await axios.get("https://app.metricool.com/api/v2/analytics/reels/instagram", {
        params: {
          from,
          to,
          blogId,
        },
        headers,
      })

      setAllReels(response.data.data)
    } catch (err) {
      setError("An error occurred while fetching reels")
    } finally {
      setIsLoading(false)
    }
  }

  const indexOfLastReel = currentPage * reelsPerPage
  const indexOfFirstReel = indexOfLastReel - reelsPerPage
  const currentReels = allReels.slice(indexOfFirstReel, indexOfLastReel)
  const totalPages = Math.ceil(allReels.length / reelsPerPage)

  return (
    <div className="container p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Instagram Reels Analytics</h1>
        <Button variant="outline" className="text-white bg-blue-500 hover:bg-blue-600" size="sm" onClick={fetchReels}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Update Reels
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton/>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full rounded-lg border bg-white border-gray-200">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-200">
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reel</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <Play className="w-4 h-4 mr-2 text-blue-500" />
                    Views
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Likes
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                    Engagement
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReels.map((reel, index) => (
                <TableRow
                  key={reel.reelId}
                  className={`cursor-pointer transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                  onClick={() => setSelectedReel(reel)}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-lg shadow-sm">
                        <Image
                          src={reel.imageUrl || "/placeholder.svg"}
                          alt="Instagram reel thumbnail"
                          fill
                          quality={85}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-[200px] text-sm text-gray-700 line-clamp-2">{reel.content}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">
                    {new Date(reel.publishedAt.dateTime).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                    {reel.videoViews.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                    {reel.likes.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                    {reel.engagement.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between px-4 mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstReel + 1} to {Math.min(indexOfLastReel, allReels.length)} of {allReels.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-white bg-blue-500 hover:bg-blue-600"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="text-white bg-blue-500 hover:bg-blue-600"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {selectedReel && <ReelDetails reel={selectedReel} onClose={() => setSelectedReel(null)} />}
    </div>
  )
}


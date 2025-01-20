// "use client"

// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Download, LayoutGrid, RefreshCwIcon, Search, ImageIcon, Heart, MessageCircle, Share2, Eye, TrendingUp, BarChart3 } from 'lucide-react'
// import Image from 'next/image'
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import PostData from './PostData'

// interface FBPost {
//   internalSearchId: string
//   created: { dateTime: string }
//   impressions: number
//   impressionsOrganic: number
//   impressionsPaid: number
//   impressionsUnique: number
//   engagement: number
//   clicks: number
//   comments: number
//   link: string
//   picture: string
//   text: string
//   postId:string
// }

// export default function FacebookPosts() {
//   const [allPosts, setAllPosts] = useState<FBPost[]>([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const postsPerPage = 10
//   const blogId = localStorage.getItem("blogId")

//   const headers = {
//     Accept: "application/json",
//     "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD"
//   }

//   useEffect(() => {
//     fetchPosts()
//   }, [])

//   const fetchPosts = async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//         const formatDateTime = (date: Date) => {
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, "0");
//             const day = String(date.getDate()).padStart(2, "0");
//             const hours = String(date.getHours()).padStart(2, "0");
//             const minutes = String(date.getMinutes()).padStart(2, "0");
//             const seconds = String(date.getSeconds()).padStart(2, "0");
//             return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//           }
    
//           const currentDate = new Date();
//           const threeYearsAgo = new Date();
//           threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);
    
//           const from = formatDateTime(threeYearsAgo);
//           const to = formatDateTime(currentDate);
    
//       const response = await axios.get("https://app.metricool.com/api/v2/analytics/posts/facebook", {
//         params: {
//             from,
//             to,
//             blogId
//         },
//         headers
//       })

//       setAllPosts(response.data.data)
//     } catch (err) {
//       setError('An error occurred while fetching posts')
//       console.error(err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const indexOfLastPost = currentPage * postsPerPage
//   const indexOfFirstPost = indexOfLastPost - postsPerPage
//   const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost)
//   const totalPages = Math.ceil(allPosts.length / postsPerPage)

//   if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>
//   if (error) return <div className="text-center text-red-500">{error}</div>

//   return (
//     <div className="container p-6 mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold">List of Facebook Posts</h1>
//         <Button 
//           variant="outline" 
//           className="text-white bg-blue-500" 
//           size="sm"
//           onClick={fetchPosts}
//         >
//           <RefreshCwIcon className="w-4 h-4 mr-2" />
//           Update Posts
//         </Button>
//       </div>

//       <Card className="border border-gray-200 rounded-lg">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b bg-gray-50">
//                 <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">Post</th>
//                 <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">Date</th>
//                 <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">Impressions</th>
//                 <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">Organic</th>
//                 <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">Paid</th>
//                 <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">Clicks</th>
//                 <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">Comments</th>
//                 <th className="px-4 py-3 text-sm font-medium text-right text-gray-500">Engagement</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentPosts.map((post) => (
//                 <Dialog key={post.internalSearchId}>
//                   <DialogTrigger asChild>
//                     <tr className="border-b cursor-pointer hover:bg-gray-50">
//                       <td className="px-4 py-4 text-sm">
//                         <div className="flex items-center gap-3">
//                           <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
//                             {post.picture ? (
//                               <Image
//                                 src={post.picture || "/placeholder.svg"}
//                                 alt="Facebook post"
//                                 fill
//                                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                 className="object-cover"
//                               />
//                             ) : (
//                               <div className="flex items-center justify-center w-full h-full">
//                                 <ImageIcon className="w-6 h-6 text-gray-400" />
//                               </div>
//                             )}
                                                     
//                           </div>
//                           <div className="max-w-[200px] truncate">
//                                   {post.text}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-600">
//                         {new Date(post.created.dateTime).toLocaleString()}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-right">{post.impressions.toLocaleString()}</td>
//                       <td className="px-4 py-4 text-sm text-right">{post.impressionsOrganic.toLocaleString()}</td>
//                       <td className="px-4 py-4 text-sm text-right">{post.impressionsPaid.toLocaleString()}</td>
//                       <td className="px-4 py-4 text-sm text-right">{post.clicks.toLocaleString()}</td>
//                       <td className="px-4 py-4 text-sm text-right">{post.comments.toLocaleString()}</td>
//                       <td className="px-4 py-4 text-sm text-right">{post.engagement.toLocaleString()}</td>
//                     </tr>
//                   </DialogTrigger>
//                   <DialogContent className="w-[90vw] max-w-[1000px] h-[90vh] max-h-[800px] p-0 bg-white overflow-hidden">
//                     <DialogHeader className="p-6 pb-2">
//                       <DialogTitle className="text-2xl font-bold text-gray-800">Post Insights</DialogTitle>
//                     </DialogHeader>
//                     <div className="flex flex-col min-h-[80vh] overflow-hidden">
//                       <Tabs defaultValue="details" className="flex-grow overflow-hidden">
//                         <TabsList className="px-6">
//                           <TabsTrigger value="details">Post Details</TabsTrigger>
//                           <TabsTrigger value="report">14 Days Report</TabsTrigger>
//                         </TabsList>
//                         <div className="flex-grow overflow-auto">
//                           <TabsContent value="details" className="h-full">
//                             <div className="grid h-full grid-cols-1 gap-6 p-6 md:grid-cols-3">
//                               <div className="md:col-span-1">
//                                 <div className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-gray-100 shadow-md">
//                                   {post.picture ? (
//                                     <Image
//                                       src={post.picture || "/placeholder.svg"}
//                                       alt="Facebook post"
//                                       fill
//                                       className="object-cover"
//                                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                     />
//                                   ) : (
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                       <ImageIcon className="w-16 h-16 text-gray-400" />
//                                     </div>
//                                   )}
                                   
//                                 </div>
//                                 <div className="mt-4 space-y-2">
//                                   <p className="text-sm text-gray-500">
//                                     Published on {new Date(post.created.dateTime).toLocaleDateString()}
//                                   </p>
//                                   <Badge variant="secondary" className="text-xs">
//                                     {(post.engagement / post.impressions * 100).toFixed(2)}% Engagement Rate
//                                   </Badge>
//                                 </div>
//                               </div>
//                               <div className="md:col-span-2">
//                                 <div className="h-full pr-4">
//                                   <div className="space-y-6">
//                                     <Card>
//                                       <CardContent className="p-4">
//                                         <h3 className="mb-2 text-lg font-semibold">Description</h3>
//                                         <p>{post.text}</p>
//                                       </CardContent>
//                                     </Card>
//                                     <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
//                                       <Card>
//                                         <CardContent className="flex flex-col items-center justify-center p-4">
//                                           <Eye className="w-6 h-6 mb-2 text-blue-500" />
//                                           <p className="text-2xl font-bold">{post.impressions.toLocaleString()}</p>
//                                           <p className="text-sm text-gray-500">Impressions</p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="flex flex-col items-center justify-center p-4">
//                                           <TrendingUp className="w-6 h-6 mb-2 text-green-500" />
//                                           <p className="text-2xl font-bold">{post.impressionsOrganic.toLocaleString()}</p>
//                                           <p className="text-sm text-gray-500">Organic Impressions</p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="flex flex-col items-center justify-center p-4">
//                                           <BarChart3 className="w-6 h-6 mb-2 text-purple-500" />
//                                           <p className="text-2xl font-bold">{post.impressionsPaid.toLocaleString()}</p>
//                                           <p className="text-sm text-gray-500">Paid Impressions</p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="flex flex-col items-center justify-center p-4">
//                                           <Heart className="w-6 h-6 mb-2 text-red-500" />
//                                           <p className="text-2xl font-bold">{post.engagement.toLocaleString()}</p>
//                                           <p className="text-sm text-gray-500">Engagement</p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="flex flex-col items-center justify-center p-4">
//                                           <MessageCircle className="w-6 h-6 mb-2 text-yellow-500" />
//                                           <p className="text-2xl font-bold">{post.comments.toLocaleString()}</p>
//                                           <p className="text-sm text-gray-500">Comments</p>
//                                         </CardContent>
//                                       </Card>
//                                       <Card>
//                                         <CardContent className="flex flex-col items-center justify-center p-4">
//                                           <Share2 className="w-6 h-6 mb-2 text-indigo-500" />
//                                           <p className="text-2xl font-bold">{post.clicks.toLocaleString()}</p>
//                                           <p className="text-sm text-gray-500">Clicks</p>
//                                         </CardContent>
//                                       </Card>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </TabsContent>
//                           <TabsContent value="report" className="h-full">
//                             <div className="h-full p-6">
//                               <p className="text-gray-500">14 Days Report data will be added here.</p>
//                               <PostData postId={post.postId}/>
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

//       <div className="flex items-center justify-between px-4 mt-4">
//         <div className="text-sm text-gray-500">
//           Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, allPosts.length)} of {allPosts.length} results
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             className="text-white bg-blue-500"
//             size="sm"
//             onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             className="text-white bg-blue-500"
//             size="sm"
//             onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { RefreshCwIcon, ImageIcon, EyeIcon, BarChart3Icon, HeartIcon } from 'lucide-react'
import Image from 'next/image'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FacebookPost } from '@/types/fb'
import { FacebookPostDetails } from './facebook/FacebookPostDetails'

export default function FacebookPosts() {
  const [allPosts, setAllPosts] = useState<FacebookPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null)
  const postsPerPage = 10
  const blogId = localStorage.getItem("blogId")

  const headers = {
    Accept: "application/json",
    "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD"
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      }

      const currentDate = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

      const from = formatDateTime(threeYearsAgo);
      const to = formatDateTime(currentDate);

      const response = await axios.get("https://app.metricool.com/api/v2/analytics/posts/facebook", {
        params: {
          from,
          to,
          blogId
        },
        headers
      })

      setAllPosts(response.data.data)
    } catch (err) {
      setError('An error occurred while fetching posts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(allPosts.length / postsPerPage)

  return (
    <div className="container p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">List of Facebook Posts</h1>
        <Button 
          variant="outline" 
          className="text-white bg-blue-500" 
          size="sm"
          onClick={fetchPosts}
        >
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Update Posts
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCwIcon className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
      //  <Table className="rounded-lg border bg-white border-gray-200">
      //     <TableHeader className="bg-gray-300">
      //       <TableRow className='border-b bg-gray-50'>
      //         <TableHead className='px-4 py-3 text-left text-sm font-medium text-gray-500'>Post</TableHead>
      //         <TableHead className=' px-4 py-3 text-left text-sm font-medium text-gray-500'>Date</TableHead>
      //         <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-500">Impressions</TableHead>
      //         <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-500">Engagement</TableHead>
      //         <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reactions</TableHead>
      //       </TableRow>
      //     </TableHeader>
      //     <TableBody>
      //       {currentPosts.map((post) => (
      //         <TableRow 
      //           key={post.internalSearchId}
      //           className="cursor-pointer hover:bg-gray-100"
      //           onClick={() => setSelectedPost(post)}
      //         >
      //           <TableCell>
      //             <div className="flex items-center gap-3">
      //               <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
      //                 {post.picture ? (
      //                   <Image
      //                     src={post.picture || "/placeholder.svg"}
      //                     alt="Facebook post"
      //                     fill
      //                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      //                     className="object-cover"
      //                   />
      //                 ) : (
      //                   <div className="flex items-center justify-center w-full h-full">
      //                     <ImageIcon className="w-6 h-6 text-gray-400" />
      //                   </div>
      //                 )}
      //               </div>
      //               <div className="max-w-[200px] truncate">
      //                 {post.text}
      //               </div>
      //             </div>
      //           </TableCell>
      //           <TableCell>{new Date(post.created.dateTime).toLocaleString()}</TableCell>
      //           <TableCell className="text-right">{post.impressions.toLocaleString()}</TableCell>
      //           <TableCell className="text-right">{post.engagement.toFixed(2)}%</TableCell>
      //           <TableCell className="text-right">{post.reactions.toLocaleString()}</TableCell>
      //         </TableRow>
      //       ))}
      //     </TableBody>
      //   </Table>
      <div className="overflow-x-auto">
      <Table className="w-full rounded-lg border bg-white border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-200">
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Post</TableHead>
            <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</TableHead>
            <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
              <div className="flex items-center justify-end">
                <EyeIcon className="w-4 h-4 mr-2" />
                Impressions
              </div>
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
              <div className="flex items-center justify-end">
                <BarChart3Icon className="w-4 h-4 mr-2" />
                Engagement
              </div>
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
              <div className="flex items-center justify-end">
                <HeartIcon className="w-4 h-4 mr-2" />
                Reactions
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPosts.map((post, index) => (
            <TableRow
              key={post.internalSearchId}
              className={`cursor-pointer transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
              onClick={() => setSelectedPost(post)}
            >
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-lg shadow-sm">
                    {post.picture ? (
                      <Image
                        src={post.picture || "/placeholder.svg"}
                        alt="Facebook post"
                        fill
                        quality={85}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="max-w-[200px] text-sm text-gray-700 line-clamp-2">{post.text}</div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-sm text-gray-600">
                {new Date(post.created.dateTime).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                {post.impressions.toLocaleString()}
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                {post.engagement.toFixed(2)}%
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                {post.reactions.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
      )}

      <div className="flex items-center justify-between px-4 mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, allPosts.length)} of {allPosts.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-white bg-blue-500"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="text-white bg-blue-500"
            size="sm"
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {selectedPost && (
        <FacebookPostDetails
          post={selectedPost}
          isLoading={false}
          error={null}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  )
}


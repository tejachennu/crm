// 'use client'

// import { useState, useEffect } from 'react'
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Download, LayoutGrid, RefreshCwIcon, Search } from 'lucide-react'

// interface IGPost {
//   postId: string
//   publishedAt: string
//   type: string
//   url: string
//   content: string
//   imageUrl: string
//   filter: string
//   likes: number
//   comments: number
//   interactions: number
//   engagement: number
//   impressions: number
//   reach: number
//   saved: number
//   videoViews: number
//   impressionsTotal: number
//   videoViewsTotal: number
// }

// interface PaginationMeta {
//   totalPosts: number
//   currentPage: number
//   totalPages: number
//   limit: number
// }

// export default function InstagramAnalyticsDashboard() {
//   const [posts, setPosts] = useState<IGPost[]>([])
//   const [meta, setMeta] = useState<PaginationMeta | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [limit, setLimit] = useState(5)
//   const userId = localStorage.getItem("userId")

//   useEffect(() => {
//     fetchPosts()
//   }, [currentPage, limit])

//   const fetchPosts = async () => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(`http://localhost:3003/api/IGPD/${userId}?page=${currentPage}&limit=${limit}`)
//       if (!response.ok) throw new Error('Failed to fetch posts')
//       const data = await response.json()
//       setPosts(data.data)
//       setMeta(data.meta)
//     } catch (err) {
//       setError('An error occurred while fetching posts')
//       console.error(err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
//   if (error) return <div className="text-red-500 text-center">{error}</div>

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">List of posts</h1>
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input 
//               placeholder="Search" 
//               className="pl-9 w-[280px]"
//             />
//           </div>
//           <Button variant="outline" className=' bg-blue-500 text-white' size="sm">
//             <RefreshCwIcon className="h-4 w-4 mr-2" />
//             Update Posts
//           </Button>
//           {/* <Button variant="outline" size="sm">
//             <LayoutGrid className="h-4 w-4 mr-2" />
//             Columns
//           </Button> */}
//         </div>
//       </div>

//       <Card className="rounded-lg border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b bg-gray-50">
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Impressions</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Organic Reach</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Paid Reach</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Organic Likes</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Organic Saved</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Organic Comments</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Shares</th>
//                 <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Organic Interactions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {posts.map((post) => (
//                 <tr key={post.postId} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-4 text-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded bg-gray-100"></div>
//                       <div className="max-w-[200px] truncate">{post.content}</div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 text-sm text-gray-600">
//                     {new Date(post.publishedAt).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-4 text-sm text-right">{post.impressions}</td>
//                   <td className="px-4 py-4 text-sm text-right">{post.reach}</td>
//                   <td className="px-4 py-4 text-sm text-right">-</td>
//                   <td className="px-4 py-4 text-sm text-right">{post.likes}</td>
//                   <td className="px-4 py-4 text-sm text-right">{post.saved}</td>
//                   <td className="px-4 py-4 text-sm text-right">{post.comments}</td>
//                   <td className="px-4 py-4 text-sm text-right">
//                     {post.interactions - (post.likes + post.comments + post.saved)}
//                   </td>
//                   <td className="px-4 py-4 text-sm text-right">{post.interactions}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {meta && (
//         <div className="flex justify-between items-center mt-4 px-4">
//           <div className="text-sm text-gray-500">
//             Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, meta.totalPosts)} of {meta.totalPosts} results
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               className=' bg-blue-500 text-white'
//               size="sm"
//               onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className=' bg-blue-500 text-white'
//               onClick={() => setCurrentPage(page => Math.min(meta.totalPages, page + 1))}
//               disabled={currentPage === meta.totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


import InstgramPosts from '@/components/dev-components/InstgramPosts'
import InstagramReels from '@/components/dev-components/InstgramReels'

export default function InstagramAnalyticsDashboard() {


  return (
    <div className="">
        <InstgramPosts/>
        <InstagramReels/>
    </div>
  )
}


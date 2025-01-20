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
  const [blogId, setBlogId] = useState<string | null>(null);

  useEffect(() => {
    const blogid = localStorage.getItem("blogId");
    setBlogId(blogid); // blogid is a string or null
  }, []);

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


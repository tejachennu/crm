"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { RefreshCw, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InstagramPost } from '@/types/fb'
import { InstagramPostDetailsTable } from './instgram/InstagramPostDetailsTable'
import { InstgramPostDetails } from './instgram/InstgramPostDetails'
import { TableSkeleton } from './TableSkeleton'

export default function InstagramPosts() {
  const [allPosts, setAllPosts] = useState<InstagramPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const postsPerPage = 10
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("businessId");
      setBusinessId(id);
    }
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
      const blogId = localStorage.getItem("blogId");


      const currentDate = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

      const from = formatDateTime(threeYearsAgo);
      const to = formatDateTime(currentDate);

      const response = await axios.get("https://app.metricool.com/api/v2/analytics/posts/instagram", {
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
        <h1 className="text-2xl font-semibold">List of Instagram Posts</h1>
        <Button 
          variant="outline" 
          className="text-white bg-blue-500" 
          size="sm"
          onClick={fetchPosts}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update Posts
        </Button>
      </div>

      {isLoading ? (
                  <TableSkeleton/>
        
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <Table className="w-full rounded-lg border bg-white border-gray-200">
          <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-200">
              <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600" >Post</TableHead>
              <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</TableHead>
              <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Impressions</TableHead>
              <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Engagement</TableHead>
              <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPosts.map((post) => (
              <TableRow 
                key={post.postId}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedPost(post)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl || "/placeholder.svg"}
                          alt="Instagram post"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="max-w-[200px] truncate">
                      {post.content}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{new Date(post.publishedAt.dateTime).toLocaleString()}</TableCell>
                <TableCell className="text-center">{post.impressions.toLocaleString()}</TableCell>
                <TableCell className="text-center">{post.engagement.toFixed(2)}%</TableCell>
                <TableCell className="text-center">{post.likes.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        <InstgramPostDetails
          post={selectedPost}
          isLoading={false}
          error={null}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  )
}


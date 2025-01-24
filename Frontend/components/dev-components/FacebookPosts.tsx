"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  RefreshCwIcon,
  ImageIcon,
  EyeIcon,
  BarChart3Icon,
  HeartIcon,
} from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FacebookPost } from "@/types/fb";
import { FacebookPostDetails } from "./facebook/FacebookPostDetails";
import { TableSkeleton } from "./TableSkeleton";
import { ExportButton } from "./ExportButton";
import { SendReportMail } from "./mails/sendReportMail";

export default function FacebookPosts() {
  const [allPosts, setAllPosts] = useState<FacebookPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const postsPerPage = 10;

  const headers = {
    Accept: "application/json",
    "X-Mc-Auth":
      "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  };

  useEffect(() => {
    fetchPosts();
  }, [fromDate, toDate]); // Re-run when date filters change

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const fetchPosts = async () => {
    const blogid = localStorage.getItem("blogId");
    setIsLoading(true);
    setError(null);
    try {
      const currentDate = new Date();
      // If no date is selected, use the last 3 years as default
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);
      const from = fromDate ? fromDate : formatDateTime(threeYearsAgo);
      const to = toDate ? toDate : formatDateTime(currentDate);

      const response = await axios.get(
        "https://app.metricool.com/api/v2/analytics/posts/facebook",
        {
          params: {
            from,
            to,
            blogId: blogid,
          },
          headers,
        }
      );

      setAllPosts(response.data.data);
    } catch (err) {
      setError("An error occurred while fetching posts");
    } finally {
      setIsLoading(false);
    }
  };

  const changeDate = (title: string, value: string): void => {
    const selectedDate = new Date(value);

    if (isNaN(selectedDate.getTime())) {
      console.error("Invalid date");
      return;
    }

    const formattedDate = formatDateTime(selectedDate);
    if (title === "From Date") {
      setFromDate(formattedDate);
    } else {
      setToDate(formattedDate);
    }
  };

  const handleFilter = () => {
    fetchPosts(); // Manually trigger fetch with updated dates when filter is clicked
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  return (
    <div className="container p-6 mx-auto">
      {/* <div className="flex items-center justify-between mb-6">
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
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          title='From Date'
          value={fromDate.slice(0, 10)} // Ensure value is in 'YYYY-MM-DD' format
          onChange={(e) => changeDate("From Date", e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />

        <input
          type="date"
          title='To Date'
          value={toDate.slice(0, 10)} // Ensure value is in 'YYYY-MM-DD' format
          onChange={(e) => changeDate("To Date", e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
      <Button
          variant="outline"
          className="text-white bg-blue-500"
          size="sm"
          onClick={handleFilter} // Trigger fetch on button click
        >
          Filter Posts
        </Button> 
      </div>
        <ExportButton data={currentPosts} type="facebook" reportType="detailed" />
      </div>  */}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">List of Facebook Posts</h1>
        {/* Date Filter Section */}
        <div className="flex gap-4 mb-6">
          <input
            type="date"
            title="From Date"
            value={fromDate.slice(0, 10)} // Ensure value is in 'YYYY-MM-DD' format
            onChange={(e) => changeDate("From Date", e.target.value)}
            className="border border-gray-300 p-2 rounded-sm text-sm focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="date"
            title="To Date"
            value={toDate.slice(0, 10)} // Ensure value is in 'YYYY-MM-DD' format
            onChange={(e) => changeDate("To Date", e.target.value)}
            className="border border-gray-300 p-2 rounded-sm text-sm focus:ring-2 focus:ring-blue-600"
          />

          {/* Export Button */}
          <ExportButton
            data={currentPosts}
            type="facebook"
            reportType="detailed"
            className="bg-blue-600 text-white hover:text-white  text-xs py-2 px-4 rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          />
          <SendReportMail
            data={currentPosts}
            type="facebook"
            reportType="detailed"
            className="bg-blue-600 text-white hover:text-white  text-xs py-2 px-4 rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full rounded-lg border bg-white border-gray-200">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-200">
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Post
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Impressions
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <BarChart3Icon className="w-4 h-4 mr-2" />
                    Engagement
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
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
                  className={`cursor-pointer transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
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
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="max-w-[200px] text-sm text-gray-700 line-clamp-2">
                        {post.text}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      new Date(post.created.dateTime).getTime() +
                        5.5 * 60 * 60 * 1000 // Add IST offset
                    ).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                    {post.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                    {post.engagement.toFixed(2)}%
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-sm font-medium text-gray-700">
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
          Showing {indexOfFirstPost + 1} to{" "}
          {Math.min(indexOfLastPost, allPosts.length)} of {allPosts.length}{" "}
          results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-white bg-blue-500"
            size="sm"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="text-white bg-blue-500"
            size="sm"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
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
  );
}

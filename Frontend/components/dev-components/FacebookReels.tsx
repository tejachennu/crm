"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  PlayCircle,
  Eye,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  BarChart3,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "./TableSkeleton";
import ReelsTrackingDashboard from "./DayTrackFb";
import ReelData from "./facebook/ReelData";
import { ExportButton } from "./ExportButton";
import { SendReportMail } from "./mails/sendReportMail";

interface FBReel {
  pageId: string;
  reelId: string;
  description: string;
  created: { dateTime: string };
  blueReelsPlayCount: number;
  postImpressionsUnique: number;
  postVideoAvgTimeWatchedSeconds: number;
  postVideoViewTimeSeconds: number;
  postVideoReactions: number;
  postVideoSocialActions: number;
  videoUrl: string;
  thumbnailUrl: string;
  comments: string;
  length: string;
  reelUrl: string;
  reach: string;
  engagement: string;
}

function ReelContent({ reel }: { reel: FBReel }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Reel Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <video
            src={reel.videoUrl}
            poster={reel.thumbnailUrl}
            controls
            className="w-full rounded-lg shadow-lg"
          />
          <p className="mt-4 text-sm text-gray-700">{reel.description}</p>
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
                  <PlayCircle className="w-4 h-4 mr-2 text-blue-500" /> Play
                  Count
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.blueReelsPlayCount.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-green-500" /> Unique
                  Impressions
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.postImpressionsUnique.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Avg. Watch
                  Time
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.postVideoAvgTimeWatchedSeconds.toFixed(2)} seconds
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> Total
                  View Time
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.postVideoViewTimeSeconds.toLocaleString()} seconds
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" /> Reactions
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.postVideoReactions.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2 text-indigo-500" /> Social
                  Actions
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.postVideoSocialActions.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-cyan-500" />{" "}
                  Comments
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.comments}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" /> Length
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.length}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-teal-500" /> Reach
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.reach}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-pink-500" />{" "}
                  Engagement
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reel.engagement}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ReelDetails({ reel, onClose }: { reel: FBReel; onClose: () => void }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-[1000px] h-[90vh] max-h-[800px] p-0 bg-white">
        <DialogHeader className="px-6 pt-4 pb-2 bg-gray-100">
          <DialogTitle className="flex gap-2 text-2xl font-bold text-gray-800">
            <PlayCircle className="text-blue-500" size={24} />
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
                <Card>
                  <CardHeader>
                    <CardTitle>14 Days Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReelData reelId={reel.reelId} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <div className="p-6 border-t">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FacebookReels() {
  const [allReels, setAllReels] = useState<FBReel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReel, setSelectedReel] = useState<FBReel | null>(null);
  const reelsPerPage = 10;
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // const [blogId, setBlogId] = useState<string | null>(null)

  // useEffect(() => {
  //   const blogid = localStorage.getItem("blogId")
  //   setBlogId(blogid)
  // }, [])

  const headers = {
    Accept: "application/json",
    "X-Mc-Auth":
      "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    setIsLoading(true);
    setError(null);
    try {
     
      const blogId = localStorage.getItem("blogId");
      const currentDate = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

      const from = fromDate ? fromDate : formatDateTime(threeYearsAgo);
      const to = toDate ? toDate : formatDateTime(currentDate);

      const response = await axios.get(
        "https://app.metricool.com/api/v2/analytics/reels/facebook",
        {
          params: {
            from,
            to,
            blogId,
          },
          headers,
        }
      );

      setAllReels(response.data.data);
    } catch (err) {
      setError("An error occurred while fetching reels");
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastReel = currentPage * reelsPerPage;
  const indexOfFirstReel = indexOfLastReel - reelsPerPage;
  const currentReels = allReels.slice(indexOfFirstReel, indexOfLastReel);
  const totalPages = Math.ceil(allReels.length / reelsPerPage);

  
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
    fetchReels()

  };

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="container p-6 mx-auto">
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
            data={allReels}
            type="fbReels"
            reportType="detailed"
            className="bg-blue-600 text-white hover:text-white  text-xs py-2 px-4 rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          />
          <SendReportMail
            data={allReels}
            type="fbReels"
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
                  Reel
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <PlayCircle className="w-4 h-4 mr-2 text-blue-500" />
                    Play Count
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                    Avg. Watch Time
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-end">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Reactions
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReels.map((reel, index) => (
                <TableRow
                  key={reel.reelId}
                  className={`cursor-pointer transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                  onClick={() => setSelectedReel(reel)}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-lg shadow-sm">
                        <Image
                          src={reel.thumbnailUrl || "/placeholder.svg"}
                          alt="Facebook reel thumbnail"
                          fill
                          quality={85}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="max-w-[200px] text-sm text-gray-700 line-clamp-2">
                        {reel.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">
                    {new Date(reel.created.dateTime).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    {reel.blueReelsPlayCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    {reel.postVideoAvgTimeWatchedSeconds.toFixed(2)}s
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    {reel.postVideoReactions.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between px-4 mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstReel + 1} to{" "}
          {Math.min(indexOfLastReel, allReels.length)} of {allReels.length}{" "}
          results
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
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      {selectedReel && (
        <ReelDetails
          reel={selectedReel}
          onClose={() => setSelectedReel(null)}
        />
      )}
    </div>
  );
}

"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, RefreshCwIcon, Heart, MessageCircle, Share2, Eye, TrendingUp, Clock } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface FBReel {
  pageId: string,
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

export default function FacebookReels() {
  const [allReels, setAllReels] = useState<FBReel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reelsPerPage = 10;

  const [blogId, setBlogId] = useState<string | null>(null);

  useEffect(() => {
    const blogid = localStorage.getItem("blogId");
    setBlogId(blogid); // blogid is a string or null
  }, []);

  const headers = {
    Accept: "application/json",
    "X-Mc-Auth": "IXSWRACURPFYEMDXWSRMXWJUJJMJJWMOCEKLJBOPPZTYPYXPFOUVHROLGIIFOIYD",
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      const currentDate = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

      const from = formatDateTime(threeYearsAgo);
      const to = formatDateTime(currentDate);

      const response = await axios.get("https://app.metricool.com/api/v2/analytics/reels/facebook", {
        params: {
          from,
          to,
          blogId,
        },
        headers,
      });

      setAllReels(response.data.data);
    } catch (err) {
      setError('An error occurred while fetching reels');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastReel = currentPage * reelsPerPage;
  const indexOfFirstReel = indexOfLastReel - reelsPerPage;
  const currentReels = allReels.slice(indexOfFirstReel, indexOfLastReel);
  const totalPages = Math.ceil(allReels.length / reelsPerPage);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">List of Facebook Reels</h1>
        <Button 
          variant="outline" 
          className="bg-blue-500 text-white" 
          size="sm"
          onClick={fetchReels}
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Update Reels
        </Button>
      </div>

      <Card className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thumbnail</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Play Count</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Avg Watch Time (s)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total Watch Time (s)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Reactions</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Social Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReels.map((reel) => (
                <Dialog key={reel.reelId}>
                  <DialogTrigger asChild>
                    <tr className="border-b hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-4 text-sm flex flex-row align-middle items-center gap-2">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          {reel.thumbnailUrl ? (
                            <Image
                              src={reel.thumbnailUrl || "/placeholder.svg"}
                              alt="Reel Thumbnail"
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[200px] truncate">
                                  {reel.description}
                          </div>
                        
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(reel.created.dateTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-right">{reel.blueReelsPlayCount.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-right">{reel.postVideoAvgTimeWatchedSeconds.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-right">{reel.postVideoViewTimeSeconds.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-right">{reel.postVideoReactions.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-right">{reel.postVideoSocialActions.toLocaleString()}</td>
                    </tr>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] max-w-[1000px] h-[90vh] max-h-[800px] p-0 bg-white overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="text-2xl font-bold text-gray-800">Reel Insights</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <div className="relative w-full pt-[177.78%] rounded-lg overflow-hidden bg-gray-100 shadow-md">
                              {reel.thumbnailUrl ? (
                                <Image
                                  src={reel.thumbnailUrl || "/placeholder.svg"}
                                  alt="Reel Thumbnail"
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <ImageIcon className="w-16 h-16 text-gray-400" />
                                </div>
                              )}

                            </div>
                            <div className="mt-4 space-y-2">
                              <p className="text-sm text-gray-500">
                                Published on {new Date(reel.created.dateTime).toLocaleDateString()}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {reel.length} long
                              </Badge>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="space-y-6">
                              <Card>
                                <CardContent className="p-4">
                                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                                  <ScrollArea className="h-[100px]">
                                    <p className="text-gray-700">{reel.description}</p>
                                  </ScrollArea>
                                </CardContent>
                              </Card>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <Eye className="w-6 h-6 text-blue-500 mb-2" />
                                    <p className="text-2xl font-bold">{reel.blueReelsPlayCount.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Play Count</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-500 mb-2" />
                                    <p className="text-2xl font-bold">{reel.postVideoAvgTimeWatchedSeconds.toFixed(2)}s</p>
                                    <p className="text-sm text-gray-500">Avg Watch Time</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-yellow-500 mb-2" />
                                    <p className="text-2xl font-bold">{reel.postImpressionsUnique.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Unique Impressions</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <Heart className="w-6 h-6 text-red-500 mb-2" />
                                    <p className="text-2xl font-bold">{reel.postVideoReactions.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Reactions</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-purple-500 mb-2" />
                                    <p className="text-2xl font-bold">{reel.comments}</p>
                                    <p className="text-sm text-gray-500">Comments</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <Share2 className="w-6 h-6 text-indigo-500 mb-2" />
                                    <p className="text-2xl font-bold">{reel.postVideoSocialActions.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Social Actions</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstReel + 1} to {Math.min(indexOfLastReel, allReels.length)} of {allReels.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-blue-500 text-white"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="bg-blue-500 text-white"
            size="sm"
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}


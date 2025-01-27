"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, Play, ThumbsUp, MessageCircle, Share2 } from "lucide-react";

interface ReelMetrics {
  date: string;
  blueReelsPlayCount: number;
  postImpressionsUnique: number;
  postVideoViewTimeSeconds: number;
  postVideoReactions: number;
  comments: number;
  engagement: number;
  reach: number;
}

interface DailyStats {
  [date: string]: ReelMetrics;
}

export default function ReelsTrackingDashboard({ reelId }: { reelId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReelMetrics[]>([]);
  const [totalStats, setTotalStats] = useState<{
    totalViews: number;
    totalEngagement: number;
    avgWatchTime: number;
    totalReach: number;
  }>({
    totalViews: 0,
    totalEngagement: 0,
    avgWatchTime: 0,
    totalReach: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.aquarythu.com/api/fbreels/reels/tracking/${reelId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        const formattedData = Object.entries(result.dailyStats).map(
          ([date, metrics]: [string, any]) => ({
            date,
            ...metrics,
          })
        );

        setData(formattedData);
        setTotalStats({
          totalViews: result.totalStats.totalViews,
          totalEngagement: result.totalStats.totalEngagement,
          avgWatchTime: result.totalStats.avgWatchTime,
          totalReach: result.totalStats.totalReach,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reelId]);

  // if (!data.length) {
  //   return (
  //     <Card className="w-full max-w-md mx-auto">
  //       <CardHeader>
  //         <CardTitle className="text-xl font-semibold text-gray-700">
  //           No Data Available
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <p className="text-gray-500">
  //           There is no data available for this post.Old post data is not
  //           available
  //         </p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Engagement
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.totalEngagement.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Watch Time
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.avgWatchTime.toFixed(2)}s
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.totalReach.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>14 Day Performance</CardTitle>
          <CardDescription>Daily views and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="blueReelsPlayCount"
                  stroke="#2563eb"
                  name="Views"
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#16a34a"
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Reactions and comments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="postVideoReactions"
                    stroke="#dc2626"
                    name="Reactions"
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="#9333ea"
                    name="Comments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reach & Impressions</CardTitle>
            <CardDescription>
              Unique impressions and total reach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="postImpressionsUnique"
                    stroke="#ea580c"
                    name="Unique Impressions"
                  />
                  <Line
                    type="monotone"
                    dataKey="reach"
                    stroke="#0891b2"
                    name="Reach"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Facebook,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const chartConfig = {
  metrics: {
    label: "Metrics",
  },
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-2))",
  },
  shares: {
    label: "Shares",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const PostData = ({ postId }: { postId: string }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("14d");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3003/api/fbPDtTrk/${postId}`
        );
        setData(response.data.data || []);
        setError("");
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const filteredData = data.filter((item: any) => {
    const date = new Date(item.trackDate);
    const referenceDate = new Date();
    let daysToSubtract = 14;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const value: string | number | null | undefined = null;

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="w-full mx-auto my-auto h-[40vh]">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <Facebook className="w-12 h-12 text-blue-500 animate-pulse" />
            <CardTitle className="text-xl font-semibold text-gray-700">
              Fetching Facebook Post Data
            </CardTitle>
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-md mx-auto">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data.length) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            No Data Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            There is no data available for this post.Old post data is not
            available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-2rem)] mx-auto max-w-[900px] pb-96">
      <Card>
        <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Post Performance Metrics</CardTitle>
            <CardDescription>
              Showing engagement metrics over time
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 14 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="14d" className="rounded-lg">
                Last 14 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-views)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-views)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-likes)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-likes)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillShares" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-shares)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-shares)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="trackDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="impressions"
                name="Views"
                type="natural"
                fill="url(#fillViews)"
                stroke="var(--color-views)"
              />
              <Area
                dataKey="reactions"
                name="Likes"
                type="natural"
                fill="url(#fillLikes)"
                stroke="var(--color-likes)"
              />
              <Area
                dataKey="shares"
                name="Shares"
                type="natural"
                fill="url(#fillShares)"
                stroke="var(--color-shares)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-md ">
        <div className="p-4 mx-auto overflow-x-auto max-w-7xl">
          <Table className="w-full">
            <TableHeader className="text-white bg-black">
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableHead key={key} className="text-white capitalize">
                    {key.replace(/_/g, " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
  {paginatedData.map((entry, rowIndex) => (
    <TableRow key={rowIndex}>
      {Object.values(entry).map((value, colIndex) => (
        <TableCell
          key={`${rowIndex}-${colIndex}`}
          className="text-gray-600"
        >
          {typeof value === "number"
            ? value.toLocaleString()
            : typeof value === "string"
            ? value
            : value === null || value === undefined
            ? "N/A"
            : JSON.stringify(value)} {/* Fallback for objects or arrays */}
        </TableCell>
      ))}
    </TableRow>
  ))}
</TableBody>

          </Table>
        </div>

        <div className="flex items-center justify-between p-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </Button>
          <p className="text-gray-700">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostData;

"use client";
import { useParams } from "next/navigation";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowLeft,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Shield,
  Zap,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";

// Mock data for the website
const websiteData = {
  id: 1,
  name: "Main Website",
  url: "https://example.com",
  status: "up",
  uptime: "99.9%",
  avgResponseTime: "142ms",
  location: "New York",
  ssl: "Valid",
  sslExpiry: "45 days",
  lastChecked: "30 seconds ago",
};

interface Tick {
  timestamp: string;
  status: string;
  responseTime: number;
}

interface WebsiteData {
  websiteId: string;
  url: string;
  ticks: Tick[];
}

interface WebsiteStats {
  uptime: number;
  avgResponseTime: number;
  status: string;
}

export default function WebsiteDetails() {
  const params = useParams();
  const websiteId = params.websiteid as string;
  const [isLoading, setIsLoading] = useState(true);
  const [halfHourData, setHalfHourData] = useState<WebsiteData | null>(null);
  const [oneDayData, setOneDayData] = useState<WebsiteData | null>(null);
  const [websiteStats, setWebsiteStats] = useState<WebsiteStats>({
    uptime: 0,
    avgResponseTime: 0,
    status: "checking",
  });

  const fetchData = async () => {
    try {
      const [halfHourRes, oneDayRes] = await Promise.all([
        axios.get<WebsiteData>(`${BACKEND_URL}/halfHour/${websiteId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
        axios.get<WebsiteData>(`${BACKEND_URL}/oneDay/${websiteId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
      ]);

      setHalfHourData(halfHourRes.data);
      setOneDayData(oneDayRes.data);

      // Calculate stats
      const recentTicks = halfHourRes.data.ticks;
      const upTicks = recentTicks.filter(
        (tick) => tick.status.toLowerCase() === "up"
      ).length;
      const avgResponse =
        recentTicks.reduce((acc, tick) => acc + tick.responseTime, 0) /
        recentTicks.length;

      setWebsiteStats({
        uptime:
          recentTicks.length > 0 ? (upTicks / recentTicks.length) * 100 : 0,
        avgResponseTime: avgResponse || 0,
        status: recentTicks[0]?.status.toLowerCase() || "checking",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching website data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [websiteId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "up":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Online
          </Badge>
        );
      case "down":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Offline
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Slow
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Unknown
          </Badge>
        );
    }
  };

  interface TooltipProps {
    active?: boolean;
    payload?: {
      dataKey: string;
      value: number;
      color: string;
    }[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length && label) {
      const formattedTime = new Date(label).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Time: ${formattedTime}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === "responseTime" ? "ms" : entry.dataKey === "uptime" ? "%" : ""}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="flex h-16 items-center px-4 lg:px-6">
          <Link className="flex items-center justify-center" href="/">
            <Activity className="h-6 w-6 text-green-500" />
            <span className="ml-2 text-xl font-bold text-white">
              UptimeWatch
            </span>
          </Link>
          <nav className="ml-8 flex gap-6">
            <Link
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="text-sm font-medium text-green-400"
              href=""
            >
              Analytics
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-6 space-y-6">
        {/* Back Button & Website Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Website Info Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(websiteStats.status)}
                  <div>
                    <CardTitle className="text-2xl text-white flex items-center gap-3">
                      {halfHourData?.url || "Loading..."}
                      {getStatusBadge(websiteStats.status)}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a
                        href={halfHourData?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        {halfHourData?.url || "Loading..."}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Uptime: </span>
                  <span className="text-white font-semibold">
                    {websiteStats.uptime.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-300">Avg Response: </span>
                  <span className="text-white font-semibold">
                    {Math.round(websiteStats.avgResponseTime)}ms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-300">Last Check: </span>
                  <span className="text-white font-semibold">
                    {halfHourData?.ticks[0]
                      ? new Date(
                          halfHourData.ticks[0].timestamp
                        ).toLocaleTimeString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Charts Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 30 Minute Analysis */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      30 Minute Analysis
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Response time over the last 30 minutes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={halfHourData?.ticks || []}>
                      <defs>
                        <linearGradient
                          id="responseTimeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleTimeString()
                        }
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="responseTime"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#responseTimeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 24 Hour Analysis */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      24 Hour Analysis
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Response time over 24 hours
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={oneDayData?.ticks || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="timestamp"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
                        }}
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="responseTime"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Ticks Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Checks</CardTitle>
            <CardDescription className="text-gray-400">
              Latest monitoring checks with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Timestamp</TableHead>
                    <TableHead className="text-gray-300 hidden sm:table-cell">
                      Response Time
                    </TableHead>
                    <TableHead className="text-gray-300 hidden lg:table-cell">
                      Region
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {halfHourData?.ticks.slice(0, 10).map((tick, index) => (
                    <TableRow
                      key={index}
                      className="border-gray-700 hover:bg-gray-700/30"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tick.status.toLowerCase())}
                          <span className="hidden sm:inline">
                            {getStatusBadge(tick.status.toLowerCase())}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white font-mono text-sm">
                          {new Date(tick.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span className="text-white">
                            {tick.responseTime > 0
                              ? `${tick.responseTime}ms`
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-gray-300">USA</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

"use client";

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
import { Input } from "@/components/ui/input";
import {
  Activity,
  Plus,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  X,
  Zap,
  Shield,
  Bell,
  LogOut,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface WebsiteResponse {
  id: string;
  url: string;
  user_id: string;
  time_added: string;
  ticks: {
    id: string;
    status: string;
    response_time_ms: number;
    region_id: string;
    website_id: string;
    createdAt: string;
  }[];
}

interface Website {
  id: string;
  url: string;
  status: "up" | "down" | "checking";
  responseTime: number;
  lastChecked: string;
}

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    url: "",
    checkInterval: "30",
    location: "auto",
  });
  const Router = useRouter();
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fetchWebsites = async () => {
    try {
      const res = await axios.get<WebsiteResponse[]>(
        `${BACKEND_URL}/websites`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setWebsites(
        res.data.map((w: WebsiteResponse) => ({
          id: w.id,
          url: w.url,
          status: w.ticks[0]
            ? (w.ticks[0].status.toLowerCase() as Website["status"])
            : "checking",
          responseTime: w.ticks[0] ? w.ticks[0].response_time_ms : 0,
          lastChecked: w.ticks[0]
            ? new Date(w.ticks[0].createdAt).toLocaleString()
            : "N/A",
        }))
      );
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BACKEND_URL}/website`,
        {
          url: newWebsite.url,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      fetchWebsites();

      console.log("New website added:", newWebsite);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding website:", error);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchWebsites();

    // Then set up interval for subsequent fetches
    const interval = setInterval(async () => {
      fetchWebsites();
    }, 30000); // Fetch websites every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogOut = ()=>{
    localStorage.removeItem("token");
    Router.push("/");
  }

  const getStatusIcon = (status: "up" | "down" | "checking") => {
    switch (status) {
      case "up":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "checking":
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: "up" | "down" | "checking") => {
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
      case "checking":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Checking
          </Badge>
        );
    }
  };
  const [websites, setWebsites] = useState<Website[]>([]);
  const upSites = websites.filter((site) => site.status === "up").length;
  const downSites = websites.filter((site) => site.status === "down").length;
  const checkingSites = websites.filter(
    (site) => site.status === "checking"
  ).length;
  const avgResponseTime =
    websites.length > 0
      ? Math.round(
          websites.reduce((acc, site) => acc + site.responseTime, 0) /
            websites.length
        )
      : 0;

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
          <nav className="ml-8 hidden md:flex gap-6">
            <Link
              className="text-sm font-medium text-green-400"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Website
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white sm:hidden w-10 h-10 p-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hover:cursor-pointer w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <span className="font-bold text-sm"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border border-gray-700 shadow-lg">
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Monitor your websites and track their performance
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white sm:hidden"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Website
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">
                Total Websites
              </CardTitle>
              <Globe className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {websites.length}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400">
                <span className="text-green-400">+2</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Online
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{upSites}</div>
              <p className="text-xs text-gray-400">
                {((upSites / websites.length) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{downSites}</div>
              <p className="text-xs text-gray-400">
                {downSites} down, {checkingSites} checking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Avg Response
              </CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {avgResponseTime}ms
              </div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">-12ms</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Websites Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Websites</CardTitle>
            <CardDescription className="text-gray-400">
              Manage and monitor all your websites from one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-300 w-[40%] sm:w-auto">
                      Website
                    </TableHead>
                    <TableHead className="text-gray-300 w-[40%] sm:w-auto">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">
                      Response Time
                    </TableHead>
                    <TableHead className="text-gray-300 hidden lg:table-cell">
                      Last Checked
                    </TableHead>
                    <TableHead className="text-gray-300 w-[20%] sm:w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {websites.map((website) => (
                    <TableRow
                      key={website.id}
                      className="border-gray-700 hover:bg-gray-700/30 hover:cursor-pointer"
                      onClick={() => {
                        Router.push(`/website/${website.id}`);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(website.status)}
                          <div className="min-w-0">
                            <div className="text-sm text-gray-400 truncate">
                              {website.url}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(website.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-white">
                          {website.responseTime}ms
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-gray-400">
                          {website.lastChecked}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="bg-gray-800 border-gray-700"
                            align="end"
                          >
                            <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Visit Site
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Website Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <Card className="bg-gray-900 border-gray-700 shadow-2xl">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="h-6 w-6 text-green-500" />
                    <CardTitle className="text-2xl text-white">
                      Add Website
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Start monitoring a new website for uptime and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddWebsite} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="websiteName"
                      className="text-sm font-medium text-gray-300"
                    >
                      Website Name
                    </label>
                    <Input
                      id="websiteName"
                      placeholder="My Website"
                      value={newWebsite.name}
                      onChange={(e) =>
                        setNewWebsite({ ...newWebsite, name: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="websiteUrl"
                      className="text-sm font-medium text-gray-300"
                    >
                      Website URL
                    </label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://example.com"
                      value={newWebsite.url}
                      onChange={(e) =>
                        setNewWebsite({ ...newWebsite, url: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="checkInterval"
                      className="text-sm font-medium text-gray-300"
                    >
                      Check Interval
                    </label>
                    <Select
                      value={newWebsite.checkInterval}
                      onValueChange={(value) =>
                        setNewWebsite({ ...newWebsite, checkInterval: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem
                          value="30"
                          className="text-gray-300 hover:bg-gray-700"
                        >
                          3 minutes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium text-gray-300"
                    >
                      Monitoring Location
                    </label>
                    <Select
                      value={newWebsite.location}
                      onValueChange={(value) =>
                        setNewWebsite({ ...newWebsite, location: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem
                          value="auto"
                          className="text-gray-300 hover:bg-gray-700"
                        >
                          Auto (All locations)
                        </SelectItem>
                        <SelectItem
                          value="us-east"
                          className="text-gray-300 hover:bg-gray-700"
                        >
                          US East (New York)
                        </SelectItem>
                        <SelectItem
                          value="eu-west"
                          className="text-gray-300 hover:bg-gray-700"
                        >
                          EU West (London)
                        </SelectItem>
                        <SelectItem
                          value="ap-east"
                          className="text-gray-300 hover:bg-gray-700"
                        >
                          Asia Pacific (Tokyo)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <div className="text-sm text-gray-300">
                      You&apos;ll receive alerts via email when this website
                      goes down
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Add Website
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

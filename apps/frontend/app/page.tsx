"use client";

import { useState } from "react";
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
  BarChart3,
  Bell,
  CheckCircle,
  Globe,
  Monitor,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  UserIcon,
  Star,
  Database,
  TrendingUp,
  Users,
  Code,
  Server,
  Headphones,
  X,
  Eye,
  EyeOff,
  Github,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signin`, {
        username: email,
        password,
      });

      localStorage.setItem("token", response.data.jwt);
      setShowSignIn(false);
      Router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        username: email,
        password,
      });

      setShowSignUp(false);
      setShowSignIn(true);
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex flex-wrap items-center justify-between border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <Link className="flex items-center justify-center" href="#">
          <Activity className="h-6 w-6 text-green-500" />
          <span className="ml-2 text-xl font-bold text-white">UptimeWatch</span>
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-green-400 transition-colors text-gray-300"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-green-400 transition-colors text-gray-300"
            href="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:text-green-400 transition-colors text-gray-300"
            href="#about"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
           {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => Router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsAuthenticated(false);
                }}
              >
                <span className="md:hidden">
                  <X className="h-4 w-4" />
                </span>
                <span className="hidden md:inline">Log Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setShowSignIn(true)}
              >
                <span className="md:hidden">
                  <UserIcon className="h-4 w-4" />
                </span>
                <span className="hidden md:inline">Sign In</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg.jpg"
              alt="Monitoring Dashboard"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <Badge className="inline-flex bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    99.9% Uptime Guaranteed
                  </Badge>
                  <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Monitor Your Websites
                    <span className="text-green-400"> 24/7</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl">
                    Get instant alerts when your websites go down. Monitor
                    uptime, performance, and SSL certificates from locations
                    worldwide with enterprise-grade reliability.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  >
                    Start Monitoring Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent w-full sm:w-auto"
                  >
                    View Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />5 monitors
                    free
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="relative bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          Live Status
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-400">
                            All systems operational
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            name: "Website API",
                            status: "up",
                            response: "142ms",
                          },
                          { name: "Database", status: "up", response: "89ms" },
                          { name: "CDN", status: "up", response: "23ms" },
                          {
                            name: "SSL Certificate",
                            status: "valid",
                            response: "45 days",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-300">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {item.response}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 bg-gray-800 border-y border-gray-700">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50K+</div>
                <div className="text-sm text-gray-400">Websites Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">1M+</div>
                <div className="text-sm text-gray-400">Checks Daily</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">30s</div>
                <div className="text-sm text-gray-400">Check Frequency</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-800 text-gray-300"
                >
                  Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Everything you need to monitor your websites
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comprehensive monitoring tools to keep your websites running
                  smoothly and your users happy.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Monitor className="h-10 w-10 text-green-500" />
                  <CardTitle className="text-white">
                    Website Monitoring
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor HTTP/HTTPS, ping, port, and keyword checks from
                    multiple global locations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">
                        HTTP/HTTPS monitoring
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">
                        Ping & port monitoring
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">Keyword detection</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Bell className="h-10 w-10 text-blue-500" />
                  <CardTitle className="text-white">Instant Alerts</CardTitle>
                  <CardDescription className="text-gray-400">
                    Get notified immediately when your website goes down via
                    email, SMS, Slack, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">Email & SMS alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">Slack integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">Webhook support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-purple-500" />
                  <CardTitle className="text-white">
                    Detailed Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    View comprehensive reports, uptime statistics, and
                    performance metrics over time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">
                        Response time tracking
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">Uptime statistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-300">Historical data</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Globe className="h-10 w-10 text-orange-500" />
                  <CardTitle className="text-white">
                    Global Monitoring
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor from 15+ locations worldwide to ensure your site is
                    accessible everywhere.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Shield className="h-10 w-10 text-red-500" />
                  <CardTitle className="text-white">SSL Monitoring</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track SSL certificate expiration and get alerts before they
                    expire.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Smartphone className="h-10 w-10 text-indigo-500" />
                  <CardTitle className="text-white">Mobile App</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor your websites on the go with our iOS and Android
                    mobile apps.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Database className="h-10 w-10 text-cyan-500" />
                  <CardTitle className="text-white">
                    Database Monitoring
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor database connections, query performance, and server
                    health.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Server className="h-10 w-10 text-yellow-500" />
                  <CardTitle className="text-white">
                    Server Monitoring
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Track CPU, memory, disk usage, and server performance
                    metrics.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <Code className="h-10 w-10 text-pink-500" />
                  <CardTitle className="text-white">API Monitoring</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor REST APIs, GraphQL endpoints, and webhook
                    reliability.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-gray-300"
                >
                  How it Works
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Get started in 3 simple steps
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                  <span className="text-2xl font-bold text-green-400">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Add Your Websites
                </h3>
                <p className="text-gray-400">
                  Simply enter your website URLs and configure monitoring
                  settings in seconds.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  We Monitor 24/7
                </h3>
                <p className="text-gray-400">
                  Our global network checks your websites every 30 seconds from
                  multiple locations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Get Instant Alerts
                </h3>
                <p className="text-gray-400">
                  Receive immediate notifications when issues are detected so
                  you can act fast.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-800 text-gray-300"
                >
                  Testimonials
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Trusted by thousands of businesses
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    &quote;UptimeWatch has been a game-changer for our business.
                    We catch issues before our customers do and our uptime has
                    improved by 40%!&quote;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">SJ</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Sarah Johnson</p>
                      <p className="text-sm text-gray-400">CTO, TechCorp</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          500+ employees
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    &quote;The detailed analytics help us understand our website
                    performance better than ever. The mobile app is fantastic
                    too!&quote;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">MC</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Mike Chen</p>
                      <p className="text-sm text-gray-400">
                        DevOps Engineer, StartupXYZ
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Series A Startup
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    &quote;Simple setup, reliable monitoring, and excellent
                    customer support. Our downtime decreased by 85% since
                    switching!&quote;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">ED</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Emily Davis</p>
                      <p className="text-sm text-gray-400">
                        Founder, E-commerce Plus
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Headphones className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          24/7 Support
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] opacity-10"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start monitoring your websites today
                </h2>
                <p className="max-w-[600px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of businesses that trust UptimeWatch to keep
                  their websites running smoothly.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-green-100">
                  Start with 5 free monitors. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-gray-900">
        <p className="text-xs text-gray-400">
          © 2024 UptimeWatch. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </footer>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <Card className="bg-gray-900 border-gray-700 shadow-2xl">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-green-500" />
                    <CardTitle className="text-2xl text-white">
                      Welcome back
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSignIn(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Sign in to your UptimeWatch account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4" onSubmit={handleSignIn}>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-300"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-300"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-green-500"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                    <Button
                      variant="link"
                      className="px-0 text-green-400 hover:text-green-300"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Sign In
                  </Button>
                </form>
                <div className="text-center text-sm text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="link"
                    className="px-0 text-green-400 hover:text-green-300"
                    onClick={() => {
                      setShowSignIn(false);
                      setShowSignUp(true);
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <Card className="bg-gray-900 border-gray-700 shadow-2xl">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-green-500" />
                    <CardTitle className="text-2xl text-white">
                      Create account
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSignUp(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Start monitoring your websites for free
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                  </div>
                </div>
                <form className="space-y-4" onSubmit={handleSignUp}>
                  <div className="space-y-2">
                    <label
                      htmlFor="signupEmail"
                      className="text-sm font-medium text-gray-300"
                    >
                      Email
                    </label>
                    <Input
                      id="signupEmail"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="signupPassword"
                      className="text-sm font-medium text-gray-300"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-300"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="terms"
                      type="checkbox"
                      className="rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-300">
                      I agree to the{" "}
                      <Button
                        variant="link"
                        className="px-0 text-green-400 hover:text-green-300 h-auto"
                      >
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button
                        variant="link"
                        className="px-0 text-green-400 hover:text-green-300 h-auto"
                      >
                        Privacy Policy
                      </Button>
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Create Account
                  </Button>
                </form>
                <div className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="px-0 text-green-400 hover:text-green-300"
                    onClick={() => {
                      setShowSignUp(false);
                      setShowSignIn(true);
                    }}
                  >
                    Sign in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

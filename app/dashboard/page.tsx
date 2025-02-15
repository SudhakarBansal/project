"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { NavMenu } from "@/components/nav-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";

interface CheckIn {
  created_at: string;
  mood: number;
  stress_level: number;
  productivity_level: number;
  user_name: string;
}

export default function Dashboard() {
  const [name, setName] = useState("");
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  const handleFetchCheckIns = async () => {
    if (!name.trim()) {
      alert("Please enter a valid name.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("check_ins")
        .select("*")
        .eq("user_name", name.trim())
        .order("created_at", { ascending: true });

      if (error) throw error;

      setCheckIns(data || []);
      setIsFetched(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = checkIns.map((checkIn) => ({
    date: new Date(checkIn.created_at!).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    mood: checkIn.mood,
    stress: checkIn.stress_level,
    productivity: checkIn.productivity_level,
  }));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Always Visible */}
      <div className="hidden lg:block w-64 border-r p-6 min-h-screen">
        <div className="flex items-center gap-2 mb-8">
          <Activity className="h-6 w-6" />
          <h1 className="font-semibold">Wellness Tracker</h1>
        </div>
        <NavMenu />
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <h1 className="font-semibold">Wellness Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6">
              <NavMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">
              {isFetched ? "Your Dashboard" : "Enter Your Name"}
            </h2>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          {/* Name Input Form (Visible Until Data is Fetched) */}
          {!isFetched && (
            <div className="text-lg max-w-md mx-auto">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border rounded-md border-input bg-background"
              />
              <Button onClick={handleFetchCheckIns} className="mt-2 w-full">
                Fetch Check-ins
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-lg text-center mt-4">Loading dashboard...</div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-lg text-red-500 text-center mt-4">
              Error loading dashboard: {error}
            </div>
          )}

          {/* Dashboard Content (Only Show After Fetching Data) */}
          {isFetched && !loading && !error && (
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">Weekly Trends</h3>
                <div className="h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="hsl(var(--chart-1))"
                        name="Mood"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="stress"
                        stroke="hsl(var(--chart-2))"
                        name="Stress"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="productivity"
                        stroke="hsl(var(--chart-3))"
                        name="Productivity"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* AI Insights */}
              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">AI Insights</h3>
                <p className="text-muted-foreground">
                  Based on your recent check-ins, your stress levels have been
                  decreasing while productivity has improved. Keep up the good
                  work!
                </p>
              </Card>

              {/* Recommendations */}
              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Taking regular breaks during peak stress hours</li>
                  <li>Maintaining your current work-life balance</li>
                  <li>Scheduling focus time for complex tasks</li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

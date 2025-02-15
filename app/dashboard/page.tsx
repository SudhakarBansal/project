"use client"

import { Card } from "@/components/ui/card"
import { NavMenu } from "@/components/nav-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Activity, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { date: "Mon", mood: 8, stress: 4, productivity: 7 },
  { date: "Tue", mood: 6, stress: 6, productivity: 6 },
  { date: "Wed", mood: 7, stress: 5, productivity: 8 },
  { date: "Thu", mood: 8, stress: 3, productivity: 9 },
  { date: "Fri", mood: 9, stress: 2, productivity: 9 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
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
              <div className="flex items-center gap-2 mb-8">
                <Activity className="h-6 w-6" />
                <h1 className="font-semibold">Wellness Tracker</h1>
              </div>
              <NavMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 border-r p-6 min-h-screen">
          <div className="flex items-center gap-2 mb-8">
            <Activity className="h-6 w-6" />
            <h1 className="font-semibold">Wellness Tracker</h1>
          </div>
          <NavMenu />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold">Your Dashboard</h2>
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              {/* Weekly Trends */}
              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">Weekly Trends</h3>
                <div className="h-[300px] lg:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        padding={{ left: 0, right: 0 }}
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis
                        padding={{ top: 20, bottom: 20 }}
                        tick={{ fill: 'currentColor' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                      />
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
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Based on your recent check-ins, your stress levels have been decreasing while productivity has improved. Keep up the good work!
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Stress levels down 40% this week</li>
                    <li>Productivity up 20% from last week</li>
                    <li>Mood trending positively</li>
                  </ul>
                </div>
              </Card>

              {/* Recommendations */}
              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    To maintain your positive trajectory, consider:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Taking regular breaks during peak stress hours</li>
                    <li>Maintaining your current work-life balance</li>
                    <li>Scheduling focus time for complex tasks</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
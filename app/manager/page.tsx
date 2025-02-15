"use client"

import { Card } from "@/components/ui/card"
import { NavMenu } from "@/components/nav-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Users,
  Menu,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Manager() {
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold">Manager Dashboard</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Select defaultValue="engineering">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
                <div className="hidden lg:block">
                  <ThemeToggle />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Team Size</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ArrowUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ArrowDown className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Burnout Risk</p>
                      <p className="text-2xl font-bold">15%</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Alerts</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">Team Health Overview</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overall Morale</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stress Level</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Work Satisfaction</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium">High Stress Detected</p>
                      <p className="text-sm text-muted-foreground">3 team members showing elevated stress levels</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium">Burnout Risk</p>
                      <p className="text-sm text-muted-foreground">2 team members at risk of burnout</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Based on recent team data:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Consider implementing flexible work hours</li>
                    <li>Schedule one-on-one check-ins with at-risk team members</li>
                    <li>Plan team building activities to maintain high morale</li>
                    <li>Review workload distribution</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <h3 className="text-lg font-medium mb-4">Action Items</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                    <p className="text-sm">Schedule wellness workshop</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                    <p className="text-sm">Review project deadlines</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <p className="text-sm">Plan team building event</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
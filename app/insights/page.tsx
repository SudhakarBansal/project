"use client"

import { useEffect, useState } from "react"
import { format, subDays } from "date-fns"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Activity } from "lucide-react"

import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavMenu } from "@/components/nav-menu"
import { supabase, type CheckIn } from "@/lib/supabase"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type ChartDataPoint = {
  date: string
  value: number
}

export default function InsightsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<{
    line: ChartData<'line'>
    bar: ChartData<'bar'>
  }>({
    line: {
      labels: [],
      datasets: []
    },
    bar: {
      labels: [],
      datasets: []
    }
  })

  // Fetch check-ins data
  useEffect(() => {
    async function fetchCheckIns() {
      try {
        const { data, error } = await supabase
          .from('check_ins')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error

        setCheckIns(data || [])
        console.log(data);
        
        updateChartData(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching check-ins:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCheckIns()
  }, [])

  // Process and update chart data
  const updateChartData = (data: CheckIn[]) => {
    // Process data for line chart
    const dates = Array.from(new Set(data.map(item => 
      format(new Date(item.created_at!), 'MMM d')
    ))).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    )

    const stressData = dates.map(date => {
      const dayData = data.filter(item => 
        format(new Date(item.created_at!), 'MMM d') === date
      )
      return dayData.reduce((acc, curr) => acc + curr.stress_level, 0) / dayData.length
    })

    const productivityData = dates.map(date => {
      const dayData = data.filter(item => 
        format(new Date(item.created_at!), 'MMM d') === date
      )
      return dayData.reduce((acc, curr) => acc + curr.productivity_level, 0) / dayData.length
    })

    // Process data for bar chart
    const moodCounts = data.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    setChartData({
      line: {
        labels: dates,
        datasets: [
          {
            label: 'Stress Level',
            data: stressData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3,
          },
          {
            label: 'Productivity Level',
            data: productivityData,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.3,
          },
        ],
      },
      bar: {
        labels: ['Happy', 'Neutral', 'Sad'],
        datasets: [
          {
            label: 'Mood Distribution',
            data: [
              moodCounts['happy'] || 0,
              moodCounts['neutral'] || 0,
              moodCounts['sad'] || 0,
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          },
        ],
      }
    })
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading insights...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-red-500">Error loading insights: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <h1 className="font-semibold">Wellness Tracker</h1>
        </div>
          <ThemeToggle />
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
        <div className="flex-1 p-4 lg:p-8 w-full">
          <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold">Insights</h2>
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>

            <div className="grid gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-2">Total Check-ins</h3>
                  <p className="text-3xl font-bold">{checkIns.length}</p>
              </Card>
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-2">Average Stress</h3>
                  <p className="text-3xl font-bold">
                    {(checkIns.reduce((acc, curr) => acc + curr.stress_level, 0) / checkIns.length || 0).toFixed(1)}
                  </p>
              </Card>
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-2">Average Productivity</h3>
                  <p className="text-3xl font-bold">
                    {(checkIns.reduce((acc, curr) => acc + curr.productivity_level, 0) / checkIns.length || 0).toFixed(1)}
                  </p>
              </Card>
            </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Stress & Productivity Trends</h3>
                  <div className="h-[300px]">
                    <Line options={chartOptions} data={chartData.line} />
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Mood Distribution</h3>
                  <div className="h-[300px]">
                    <Bar 
                      options={{
                        ...chartOptions,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }} 
                      data={chartData.bar}
                    />
                  </div>
                </Card>
              </div>

              {/* Recent Check-ins */}
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Recent Check-ins</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Mood</th>
                        <th className="text-left py-2">Stress</th>
                        <th className="text-left py-2">Productivity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkIns.slice(-5).reverse().map((checkIn) => (
                        <tr key={checkIn.id} className="border-b">
                          <td className="py-2">
                            {format(new Date(checkIn.created_at!), 'MMM d, yyyy')}
                          </td>
                          <td className="py-2 capitalize">{checkIn.mood}</td>
                          <td className="py-2">{checkIn.stress_level}/10</td>
                          <td className="py-2">{checkIn.productivity_level}/10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
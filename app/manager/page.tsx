"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { NavMenu } from "@/components/nav-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Users,
  Menu,
} from "lucide-react";
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
import OpenAI from "openai";

interface CheckIn {
  created_at: string;
  mood: number;
  stress_level: number;
  productivity_level: number;
  user_name: string;
}

interface TeamInsights {
  summary: string;
  recommendations: string[];
  riskFactors: {
    level: "low" | "medium" | "high";
    description: string;
  }[];
  positiveHighlights: string[];
}

const CACHE_KEY = "team_insights_cache";
const LAST_FETCH_KEY = "last_fetch_date";
const CHECKINS_HASH_KEY = "checkins_hash";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const getMoodValue = (mood: string): number => {
  switch (mood.toLowerCase()) {
    case "happy":
      return 3;
    case "neutral":
      return 2;
    case "sad":
      return 1;
    default:
      return 0;
  }
};

const getAverageMoodText = (avgMood: number): string => {
  if (avgMood >= 2.5) return "Happy";
  if (avgMood >= 1.5) return "Neutral";
  return "Sad";
};

// Function to generate a hash of check-ins data
const generateCheckInsHash = (checkIns: CheckIn[]): string => {
  return JSON.stringify(checkIns)
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
    .toString();
};

// Function to check if we should fetch new insights
const shouldFetchNewInsights = (
  currentCheckIns: CheckIn[],
  lastFetchDate: string | null,
  previousCheckInsHash: string | null
): boolean => {
  const currentDate = new Date().toISOString().split("T")[0];
  const currentHash = generateCheckInsHash(currentCheckIns);

  return (
    !lastFetchDate ||
    lastFetchDate !== currentDate ||
    previousCheckInsHash !== currentHash
  );
};

// Cache management functions
const cacheInsights = (insights: TeamInsights, checkInsHash: string) => {
  const currentDate = new Date().toISOString().split("T")[0];
  localStorage.setItem(CACHE_KEY, JSON.stringify(insights));
  localStorage.setItem(LAST_FETCH_KEY, currentDate);
  localStorage.setItem(CHECKINS_HASH_KEY, checkInsHash);
};

const getCachedInsights = (): {
  insights: TeamInsights | null;
  lastFetchDate: string | null;
  checkInsHash: string | null;
} => {
  const cachedInsights = localStorage.getItem(CACHE_KEY);
  const lastFetchDate = localStorage.getItem(LAST_FETCH_KEY);
  const checkInsHash = localStorage.getItem(CHECKINS_HASH_KEY);

  return {
    insights: cachedInsights ? JSON.parse(cachedInsights) : null,
    lastFetchDate,
    checkInsHash,
  };
};

// Helper function to calculate team metrics
const calculateTeamMetrics = (checkIns: CheckIn[]) => {
  if (!checkIns.length) {
    return {
      averageMood: "N/A",
      averageStress: "0.0",
      averageProductivity: "0.0",
      totalCheckIns: 0,
    };
  }

  const metrics = checkIns.reduce(
    (acc, curr) => ({
      avgMood: acc.avgMood + getMoodValue(curr.mood.toString()),
      avgStress: acc.avgStress + (curr.stress_level ?? 0),
      avgProductivity: acc.avgProductivity + (curr.productivity_level ?? 0),
      total: acc.total + 1,
    }),
    { avgMood: 0, avgStress: 0, avgProductivity: 0, total: 0 }
  );

  return {
    averageMood: getAverageMoodText(metrics.avgMood / metrics.total),
    averageStress: (metrics.avgStress / metrics.total).toFixed(1),
    averageProductivity: (metrics.avgProductivity / metrics.total).toFixed(1),
    totalCheckIns: metrics.total,
  };
};

// Function to generate a structured prompt
const generateAnalysisPrompt = (checkIns: CheckIn[]) => {
  const metrics = calculateTeamMetrics(checkIns);

  return `Please analyze the following team wellness data and provide insights:

Team Metrics:
- Average Mood: ${metrics.averageMood}
- Average Stress Level: ${metrics.averageStress}/10
- Average Productivity: ${metrics.averageProductivity}/10
- Total Check-ins: ${metrics.totalCheckIns}

Raw Check-in Data:
${JSON.stringify(checkIns, null, 2)}

Please provide a structured analysis in the following JSON format:
{
  "summary": "A concise overview of the team's current state",
  "recommendations": ["Action item 1", "Action item 2", "Action item 3"],
  "riskFactors": [
    {
      "level": "low|medium|high",
      "description": "Description of the risk factor"
    }
  ],
  "positiveHighlights": ["Positive aspect 1", "Positive aspect 2"]
}`;
};

// Function to get summary and recommendations
const getSummaryAndRecommendations = async (
  checkIns: CheckIn[]
): Promise<TeamInsights> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a workplace wellness expert analyzing team health data. Provide concrete, actionable insights based on the data provided.",
        },
        {
          role: "user",
          content: generateAnalysisPrompt(checkIns),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content in response");

    const insights: TeamInsights = JSON.parse(content);
    return insights;
  } catch (error) {
    console.error("Error fetching insights from OpenAI:", error);
    return {
      summary: "Error analyzing team data.",
      recommendations: ["Unable to generate recommendations at this time."],
      riskFactors: [
        {
          level: "low",
          description: "Analysis currently unavailable",
        },
      ],
      positiveHighlights: [],
    };
  }
};

const AiRecommendationsCard = ({ insights }: { insights: TeamInsights }) => (
  <Card className="p-4 lg:p-6">
    <h3 className="text-lg font-medium mb-4">AI Insights & Recommendations</h3>
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-2">Summary</h4>
        <p className="text-muted-foreground">{insights.summary}</p>
      </div>

      <div>
        <h4 className="font-medium mb-2">Recommendations</h4>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {insights.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-2">Risk Factors</h4>
        <div className="space-y-2">
          {insights.riskFactors.map((risk, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                risk.level === "high"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : risk.level === "medium"
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
              }`}
            >
              <p className="font-medium capitalize">{risk.level} Risk</p>
              <p className="text-sm text-muted-foreground">
                {risk.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {insights.positiveHighlights.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Positive Highlights</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {insights.positiveHighlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </Card>
);

export default function Manager() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<TeamInsights | null>(null);

  const fetchAndUpdateInsights = async (checkInsData: CheckIn[]) => {
    try {
      const newInsights = await getSummaryAndRecommendations(checkInsData);
      setInsights(newInsights);

      // Cache the new insights and check-ins hash
      const checkInsHash = generateCheckInsHash(checkInsData);
      cacheInsights(newInsights, checkInsHash);
    } catch (err: any) {
      console.error("Error fetching insights:", err);
      setError(err.message);
    }
  };

  const fetchCheckIns = async () => {
    setLoading(true);

    try {
      const { data: checkInsData, error: fetchError } = await supabase
        .from("check_ins")
        .select("*")
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      setCheckIns(checkInsData || []);

      // Get cached data
      const {
        insights: cachedInsights,
        lastFetchDate,
        checkInsHash,
      } = getCachedInsights();

      // Check if we need to fetch new insights
      if (shouldFetchNewInsights(checkInsData, lastFetchDate, checkInsHash)) {
        await fetchAndUpdateInsights(checkInsData);
      } else if (cachedInsights) {
        // Use cached insights if available
        setInsights(cachedInsights);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching check-ins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const chartData = checkIns.map((checkIn) => ({
    date: new Date(checkIn.created_at!).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    mood: checkIn.mood,
    stress: checkIn.stress_level,
    productivity: checkIn.productivity_level,
  }));

  // Calculate metrics
  const teamSize = checkIns.length;
  const metrics = calculateTeamMetrics(checkIns);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading manager dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-red-500">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

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
              <h2 className="text-2xl lg:text-3xl font-bold">
                Manager Dashboard
              </h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
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
                      <p className="text-2xl font-bold">{teamSize}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ArrowUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Mood</p>
                      <p className="text-2xl font-bold">
                        {metrics.averageMood}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ArrowDown className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Avg Stress
                      </p>
                      <p className="text-2xl font-bold">
                        {metrics.averageStress}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Avg Productivity
                      </p>
                      <p className="text-2xl font-bold">
                        {metrics.averageProductivity}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:gap-6 mb-8">
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
            </div>

            {insights && <AiRecommendationsCard insights={insights} />}
          </div>
        </div>
      </div>
    </div>
  );
}

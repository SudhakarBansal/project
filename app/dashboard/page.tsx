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
import OpenAI from "openai";
import { useSearchParams } from "next/navigation";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface CheckIn {
  created_at: string;
  mood: string;
  stress_level: number;
  productivity_level: number;
  user_name: string;
}

interface PersonalInsights {
  summary: string;
  recommendations: string[];
  patterns: {
    type: string;
    description: string;
  }[];
  suggestions: string[];
}

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

const calculatePersonalMetrics = (checkIns: CheckIn[]) => {
  if (!checkIns.length) {
    return {
      averageMood: 0,
      averageStress: 0,
      averageProductivity: 0,
      totalCheckIns: 0,
    };
  }

  const metrics = checkIns.reduce(
    (acc, curr) => ({
      avgMood: acc.avgMood + getMoodValue(curr.mood),
      avgStress: acc.avgStress + curr.stress_level,
      avgProductivity: acc.avgProductivity + curr.productivity_level,
      total: acc.total + 1,
    }),
    { avgMood: 0, avgStress: 0, avgProductivity: 0, total: 0 }
  );

  return {
    averageMood: metrics.avgMood / metrics.total,
    averageStress: metrics.avgStress / metrics.total,
    averageProductivity: metrics.avgProductivity / metrics.total,
    totalCheckIns: metrics.total,
  };
};

const generatePersonalAnalysisPrompt = (
  checkIns: CheckIn[],
  userName: string
) => {
  const metrics = calculatePersonalMetrics(checkIns);

  return `Please analyze the following personal wellness data for ${userName}:

Personal Metrics:
- Average Mood Score: ${metrics.averageMood.toFixed(2)}/3
- Average Stress Level: ${metrics.averageStress.toFixed(1)}/10
- Average Productivity: ${metrics.averageProductivity.toFixed(1)}/10
- Total Check-ins: ${metrics.totalCheckIns}

Check-in History:
${JSON.stringify(checkIns, null, 2)}

Please provide a personalized analysis in the following JSON format:
{
  "summary": "A personalized overview of the individual's wellness trends",
  "recommendations": ["Personalized recommendation 1", "Personalized recommendation 2", "Personalized recommendation 3"],
  "patterns": [
    {
      "type": "mood|stress|productivity",
      "description": "Description of observed pattern"
    }
  ],
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"]
}`;
};

const getPersonalInsights = async (
  checkIns: CheckIn[],
  userName: string
): Promise<PersonalInsights> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a personal wellness coach providing individualized insights based on wellness tracking data.",
        },
        {
          role: "user",
          content: generatePersonalAnalysisPrompt(checkIns, userName),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content in response");

    return JSON.parse(content);
  } catch (error) {
    console.error("Error fetching personal insights:", error);
    return {
      summary: "Unable to generate personal insights at this time.",
      recommendations: ["Please try again later."],
      patterns: [
        {
          type: "error",
          description: "Analysis currently unavailable",
        },
      ],
      suggestions: ["System temporarily unavailable"],
    };
  }
};

const getThoughtsInsights = async (
  thoughts: string
): Promise<PersonalInsights> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a wellness coach providing insights based on user thoughts. Return your analysis in a structured format.",
        },
        {
          role: "user",
          content: `Please analyze these thoughts and provide insights in JSON format: ${thoughts}

Please structure your response as follows:
{
  "summary": "Brief analysis of the thoughts",
  "recommendations": ["Key recommendation 1", "Key recommendation 2"],
  "patterns": [
    {
      "type": "thought_pattern",
      "description": "Description of observed thought pattern"
    }
  ],
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"]
}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content in response");

    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing thoughts:", error);
    return {
      summary: "Unable to analyze thoughts at this time.",
      recommendations: [],
      patterns: [],
      suggestions: [],
    };
  }
};

const PersonalInsightsCard = ({ insights }: { insights: PersonalInsights }) => (
  <Card className="p-4 lg:p-6">
    <h3 className="text-lg font-medium mb-4">Personal AI Insights</h3>
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
        <h4 className="font-medium mb-2">Observed Patterns</h4>
        <div className="space-y-2">
          {insights.patterns.map((pattern, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted">
              <p className="font-medium capitalize">{pattern.type}</p>
              <p className="text-sm text-muted-foreground">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Action Items</h4>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {insights.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  </Card>
);

export default function Dashboard() {
  const searchParams = useSearchParams();
  const thoughts = searchParams.get("thoughts");

  const [name, setName] = useState("");
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [insights, setInsights] = useState<PersonalInsights | null>(null);

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

      // Get insights from check-in data
      let combinedInsights: PersonalInsights | null = null;

      if (data && data.length > 0) {
        const checkInInsights = await getPersonalInsights(data, name.trim());
        combinedInsights = checkInInsights;
      }

      // If there are thoughts, get additional insights and combine them
      if (thoughts) {
        const thoughtInsights = await getThoughtsInsights(thoughts);

        if (combinedInsights) {
          // Combine both types of insights
          combinedInsights = {
            summary: `${combinedInsights.summary}\n\nThoughts Analysis: ${thoughtInsights.summary}`,
            recommendations: [
              ...combinedInsights.recommendations,
              ...thoughtInsights.recommendations,
            ],
            patterns: [
              ...combinedInsights.patterns,
              ...thoughtInsights.patterns,
            ],
            suggestions: [
              ...combinedInsights.suggestions,
              ...thoughtInsights.suggestions,
            ],
          };
        } else {
          combinedInsights = thoughtInsights;
        }
      }

      if (combinedInsights) {
        setInsights(combinedInsights);
      }
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

          {loading && (
            <div className="text-lg text-center mt-4">Loading dashboard...</div>
          )}

          {error && (
            <div className="text-lg text-red-500 text-center mt-4">
              Error loading dashboard: {error}
            </div>
          )}

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

              {insights && <PersonalInsightsCard insights={insights} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

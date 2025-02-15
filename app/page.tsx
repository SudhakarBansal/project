"use client"

import { useState } from "react"
import { Smile, Meh, Frown, Activity, Brain, Zap, Menu } from "lucide-react"
import { toast } from "sonner"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { NavMenu } from "@/components/nav-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { supabase, type CheckIn } from "@/lib/supabase"

export default function Home() {
  const [name, setName] = useState("")
  const [mood, setMood] = useState<"happy" | "neutral" | "sad" | null>(null)
  const [stress, setStress] = useState([5])
  const [productivity, setProductivity] = useState([5])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name")
      return
    }
    
    if (!mood) {
      toast.error("Please select your mood")
      return
    }

    setIsSubmitting(true)

    try {
      // First, get or create user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('name', name.trim())
        .single()

      let userId: string

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist, create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ name: name.trim() }])
          .select()
          .single()

        if (createError) throw createError
        userId = newUser.id
      } else if (userError) {
        throw userError
      } else {
        userId = userData.id
      }

      // Now create the check-in
      const checkInData: CheckIn = {
        user_id: userId,
        user_name: name.trim(),
        mood,
        stress_level: stress[0],
        productivity_level: productivity[0],
        notes
      }

      const { data, error } = await supabase
        .from('check_ins')
        .insert([checkInData])
        .select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Submitted data:", data)
      toast.success("Check-in submitted successfully!")
      
      // Reset form
      setMood(null)
      setStress([5])
      setProductivity([5])
      setNotes("")
      // Don't reset name to remember the user

    } catch (error: any) {
      toast.error(error.message || "Failed to submit check-in. Please try again.")
      console.error("Error submitting check-in:", error)
    } finally {
      setIsSubmitting(false)
      setName("");
      setMood(null);
      setStress([5]);
      setProductivity([5]);
      setNotes("");
    }
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
        <div className="flex-1 p-4 lg:p-8 w-full">
          <div className="max-w-2xl mx-auto pt-16 lg:pt-0">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold">Daily Check-in</h2>
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>

            <Card className="p-4 lg:p-6">
              <div className="space-y-6 lg:space-y-8">
                {/* Name Input */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Your Name</h3>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border rounded-md border-input bg-background"
                    required
                  />
                </div>

                {/* Mood Selection */}
                <div>
                  <h3 className="text-lg font-medium mb-4">How are you feeling today?</h3>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                      variant={mood === "happy" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMood("happy")}
                    >
                      <Smile className="mr-2 h-5 w-5" />
                      Great
                    </Button>
                    <Button
                      variant={mood === "neutral" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMood("neutral")}
                    >
                      <Meh className="mr-2 h-5 w-5" />
                      Okay
                    </Button>
                    <Button
                      variant={mood === "sad" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMood("sad")}
                    >
                      <Frown className="mr-2 h-5 w-5" />
                      Not Great
                    </Button>
                  </div>
                </div>

                {/* Stress Level */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Stress Level</h3>
                  <div className="flex items-center gap-4">
                    <Brain className="h-5 w-5" />
                    <Slider
                      value={stress}
                      onValueChange={setStress}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{stress[0]}/10</span>
                  </div>
                </div>

                {/* Productivity Level */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Productivity Level</h3>
                  <div className="flex items-center gap-4">
                    <Zap className="h-5 w-5" />
                    <Slider
                      value={productivity}
                      onValueChange={setProductivity}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{productivity[0]}/10</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Share your thoughts</h3>
                  <Textarea
                    placeholder="How are you feeling today? What's on your mind? Any specific reasons for your mood or stress level?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Check-in"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { Activity, BarChart3, LineChart, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Check-in", href: "/", icon: Activity },
  { name: "Dashboard", href: "/dashboard", icon: LineChart },
  { name: "Team Insights", href: "/insights", icon: BarChart3 },
  { name: "Manager View", href: "/manager", icon: Users },
]

export function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2">
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href && "bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
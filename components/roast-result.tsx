"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface UserData {
  rank: string
  roomsSolved: number
  streak: number
  badges: number
  rankPercentage: number
  events: number
}

interface RoastResultProps {
  userData: UserData
  roast: string
}

export default function RoastResult({ userData, roast }: RoastResultProps) {
  const [progress, setProgress] = useState(0)
  const [visibleStats, setVisibleStats] = useState<(keyof UserData)[]>([])
  const [showRoast, setShowRoast] = useState(false)

  const statLabels: Record<keyof UserData, string> = {
    rank: "Rank",
    roomsSolved: "Rooms Solved",
    streak: "Days Streak",
    badges: "Badges Earned",
    rankPercentage: "Rank Percentile",
    events: "Events Completed (2025)",
  }

  const statOrder: (keyof UserData)[] = ["rank", "roomsSolved", "streak", "badges", "rankPercentage", "events"]

  useEffect(() => {
    setProgress(0)
    setVisibleStats([])
    setShowRoast(false)

    // Animate progress bar
    const timer = setTimeout(() => {
      setProgress(100)
    }, 500)

    // Reveal stats one by one
    statOrder.forEach((stat, index) => {
      setTimeout(
        () => {
          setVisibleStats((prev) => [...prev, stat])
        },
        800 + index * 400,
      )
    })

    // Show roast after all stats are revealed
    setTimeout(
      () => {
        setShowRoast(true)
      },
      800 + statOrder.length * 400 + 500,
    )

    return () => clearTimeout(timer)
  }, [userData])

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-red-400">Analyzing Hacker Profile...</h2>
      <Progress
        value={progress}
        className="h-2 mb-6 bg-red-950"
        indicatorClassName="bg-gradient-to-r from-red-600 to-red-400"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {statOrder.map(
            (stat, index) =>
              visibleStats.includes(stat) && (
                <div
                  key={stat}
                  className="bg-black/40 p-4 rounded-md border-l-4 border-red-700 animate-slideIn"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-red-300">{statLabels[stat]}</span>
                    <Badge variant="outline" className="bg-red-900/50 text-white border-red-700">
                      {stat === "rankPercentage" ? `${userData[stat]}%` : userData[stat]}
                    </Badge>
                  </div>
                </div>
              ),
          )}
        </div>

        <div
          className={`bg-black/40 p-4 rounded-md border-l-4 border-red-500 h-full flex items-center ${showRoast ? "animate-fadeIn" : "opacity-0"}`}
        >
          <div>
            <h3 className="text-xl font-bold mb-2 text-red-400">The Roast:</h3>
            <Separator className="bg-red-800/50 mb-3" />
            <p className="text-white/90 italic">{roast}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


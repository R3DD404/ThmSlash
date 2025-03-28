"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"


export default function Home() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [roast, setRoast] = useState("")
  const [error, setError] = useState("")
  const [loadingStage, setLoadingStage] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return

    setLoading(true)
    setError("")
    setUserData(null)
    setRoast("")
    setLoadingStage("Fetching data...")

    try {
      const response = await fetch(`/api/thm-roast?username=${encodeURIComponent(username)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user data")
      }

      setLoadingStage("Generating roast...")

      // Simulate a slight delay for the loading stages
      setTimeout(() => {
        setUserData(data.userData)
        setRoast(data.roast)
        setLoading(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900/30 via-black to-red-900/30 text-white font-mono flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl p-8 relative">
        <div className="relative z-10 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
              THM SLASH
            </h1>
            <p className="text-white/70">The TryHackMe Roaster that cuts deep</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <Input
              type="text"
              placeholder="ENTER THM USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/50 backdrop-blur-sm border-red-500/30 text-white w-full max-w-md text-center placeholder:text-white/50 focus:border-red-500/70 transition-all duration-300"
            />
            <Button
              type="submit"
              disabled={loading || !username}
              className="bg-black/70 hover:bg-red-900/50 border border-red-500/50 text-white w-40 rounded transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] focus:shadow-[0_0_20px_rgba(239,68,68,0.7)]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "ROASTING..." : "ROAST ME!"}
            </Button>
          </form>

          {error && (
            <div className="text-red-500 mb-4 p-4 border border-red-500/50 rounded bg-black/50 backdrop-blur-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <p className="mb-2">{loadingStage}</p>
              <div className="w-full h-1 bg-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-purple-500 animate-pulse rounded"></div>
              </div>
            </div>
          )}

          {userData && roast && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg p-5 bg-black/70 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-red-500/20 to-purple-500/20 p-0.5">
                      {userData.pfp ? (
                        <img
                          src={userData.pfp || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/50 rounded-full">
                          <span className="text-xs text-white/70">no pfp</span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-red-500 tracking-wider">YOUR STATS</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Rank", value: userData.rank },
                      { label: "Rooms Solved", value: userData.roomsSolved },
                      { label: "Days Streak", value: userData.streak },
                      { label: "Badges", value: userData.badges },
                      { label: "Rank Percentile", value: `${userData.rankPercentage}%` },
                      { label: "Events (2025)", value: userData.events },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-black/80 to-black/40 p-3 rounded-md hover:from-red-900/20 hover:to-black/60 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-red-300/80">{stat.label}:</span>
                          <span className="text-white bg-black/50 px-3 py-1 rounded-md font-mono">{stat.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg p-5 bg-black/70 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <div className="bg-gradient-to-r from-red-900/30 to-black/60 rounded-md p-2 mb-6 inline-block">
                    <h2 className="text-xl font-bold text-red-500 tracking-wider">ROAST RESULT</h2>
                  </div>

                  <div className="space-y-6">
                    {roast.split("\n\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-white/90 whitespace-pre-line bg-gradient-to-r from-black/80 to-black/40 p-4 rounded-md border-l-2 border-red-500/50"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-white/70 pt-8">
            Made by R3DD |{" "}
            <a href="https://twitter.com/R3DD404" className="hover:text-red-400 transition-colors" target="_blank" rel="noopener noreferrer">
              X
            </a>{" "}
            |{" "}
            <a href="https://tryhackme.com/p/R3DD" className="hover:text-red-400 transition-colors" target="_blank" rel="noopener noreferrer">
              TryHackMe
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}


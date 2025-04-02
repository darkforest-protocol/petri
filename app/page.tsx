"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Brain, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { startAnalysis } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { storeAnalysis } from "@/lib/storage"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    
    // Generate a temporary ID for the analysis
    const tempId = crypto.randomUUID()
    
    // Redirect immediately to the visibility page
    router.push(`/prompts/${encodeURIComponent(searchQuery.trim())}/visibility?id=${tempId}`)

    try {
      // Start the analysis in the background
      const response = await startAnalysis({
        prompt: searchQuery.trim(),
        use_cache: true,
        num_completions: 1
      })

      // Store the analysis in localStorage
      storeAnalysis(searchQuery.trim(), response.request_id)

      // Update the URL with the real request ID without refreshing the page
      router.replace(`/prompts/${encodeURIComponent(searchQuery.trim())}/visibility?id=${response.request_id}`)
    } catch (error) {
      console.error('Failed to start analysis:', error)
      toast({
        title: "Error",
        description: "Failed to start analysis. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const searchEngines = [
    { name: "Perplexity", active: true, icon: "🔍" },
    { name: "ChatGPT", active: false, icon: "🤖" },
    { name: "Anthropic", active: false, icon: "🧠" },
    { name: "Grok", active: false, icon: "🔮" },
    { name: "You.com", active: false, icon: "🌐" },
    { name: "Bing AI", active: false, icon: "🔎" },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pl-40 px-4">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">What are your customers searching?</h1>
        <p className="text-lg text-muted-foreground">Optimise your site for AI search with <b>Petri</b></p>
        <form onSubmit={handleSearch} className="w-full space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter a target prompt..."
              className="w-full h-14 pl-4 pr-12 text-lg rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-2 rounded-lg"
              disabled={!searchQuery.trim() || isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload a CSV of search queries</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled className="gap-2">
                    <Brain className="h-4 w-4" />
                    Generate Prompts
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI-generated prompt suggestions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>

        <div className="pt-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Supported AI Engines</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {searchEngines.map((engine) => (
              <div
                key={engine.name}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg ${
                  engine.active ? "text-primary" : "text-muted-foreground opacity-50"
                }`}
              >
                <div className="text-2xl">{engine.icon}</div>
                <span className="text-xs font-medium">{engine.name}</span>
                {!engine.active && engine.name !== "Perplexity" && (
                  <Badge variant="outline" className="text-[10px] px-1">
                    Coming Soon
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


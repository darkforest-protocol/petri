"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ExternalLink, LinkIcon } from "lucide-react"

// Mock data for AI search engine responses
const MOCK_RESPONSES = {
  perplexity: [
    {
      id: 1,
      content: `<p>SEO optimization for AI search engines requires a different approach than traditional SEO. Here are the key strategies:</p>
      <ol>
        <li><strong>Focus on comprehensive content</strong> that answers questions thoroughly</li>
        <li><strong>Structure content with clear headings</strong> and logical organization</li>
        <li><strong>Use natural language</strong> rather than keyword stuffing</li>
        <li><strong>Implement schema markup</strong> to provide context to AI crawlers</li>
        <li><strong>Create content that demonstrates E-E-A-T</strong> (Experience, Expertise, Authoritativeness, Trustworthiness)</li>
      </ol>
      <p>AI search engines like Perplexity and ChatGPT prioritize content that provides comprehensive answers to user queries rather than just matching keywords.</p>`,
      sources: [
        { title: "AI Search Optimization Guide", url: "https://example.com/ai-seo-guide", domain: "example.com" },
        { title: "The Future of SEO in the Age of AI", url: "https://example.com/future-seo", domain: "example.com" },
        { title: "Structured Data for AI Crawlers", url: "https://example.com/structured-data", domain: "example.com" },
        {
          title: "E-E-A-T Principles for Content Creation",
          url: "https://example.com/eeat-principles",
          domain: "example.com",
        },
      ],
      metrics: {
        brandVisibility: 0,
        contentRelevance: 87,
        citationRank: 0,
        competitorPresence: 4,
      },
    },
    {
      id: 2,
      content: `<p>When optimizing for AI search engines, consider these best practices:</p>
      <ul>
        <li><strong>Answer questions directly and comprehensively</strong></li>
        <li><strong>Use clear, structured content with proper headings</strong></li>
        <li><strong>Include relevant facts, statistics, and examples</strong></li>
        <li><strong>Implement FAQ sections</strong> that address common user queries</li>
        <li><strong>Focus on user intent</strong> rather than keyword density</li>
      </ul>
      <p>AI search engines are designed to understand natural language and extract meaningful information from content. They prioritize sources that provide clear, authoritative answers to user queries.</p>
      <p>Your website <strong>example.com</strong> appears in the results for this query, but could improve its visibility with more comprehensive content addressing specific aspects of AI SEO.</p>`,
      sources: [
        { title: "AI Search Engine Optimization", url: "https://example.com/ai-seo", domain: "example.com" },
        {
          title: "Content Structure for AI Crawlers",
          url: "https://competitor.com/content-structure",
          domain: "competitor.com",
        },
        { title: "FAQ Optimization for AI Search", url: "https://example.com/faq-optimization", domain: "example.com" },
      ],
      metrics: {
        brandVisibility: 2,
        contentRelevance: 92,
        citationRank: 2,
        competitorPresence: 1,
      },
    },
  ],
}

export default function VisibilityPage() {
  const params = useParams()
  const prompt = decodeURIComponent(params.prompt as string)
  const [isLoading, setIsLoading] = useState(false)
  const [activeEngine, setActiveEngine] = useState("perplexity")
  const [activeResponseIndex, setActiveResponseIndex] = useState(0)

  // Get responses for the active engine
  const responses = MOCK_RESPONSES[activeEngine as keyof typeof MOCK_RESPONSES] || []
  const activeResponse = responses[activeResponseIndex]

  const searchEngines = [
    { id: "perplexity", name: "Perplexity", icon: "🔍" },
    { id: "chatgpt", name: "ChatGPT", icon: "🤖", disabled: true },
    { id: "anthropic", name: "Anthropic", icon: "🧠", disabled: true },
    { id: "grok", name: "Grok", icon: "🔮", disabled: true },
    { id: "you", name: "You.com", icon: "🌐", disabled: true },
    { id: "bing", name: "Bing AI", icon: "🔎", disabled: true },
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="container py-6">
      <Tabs defaultValue="perplexity" onValueChange={setActiveEngine}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {searchEngines.map((engine) => (
              <TabsTrigger key={engine.id} value={engine.id} disabled={engine.disabled} className="gap-2">
                <span>{engine.icon}</span>
                <span>{engine.name}</span>
                {engine.disabled && (
                  <Badge variant="outline" className="ml-1 text-[10px]">
                    Soon
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            Refresh
          </Button>
        </div>

        {searchEngines.map((engine) => (
          <TabsContent key={engine.id} value={engine.id} className="mt-0">
            {isLoading ? (
              <ResponseSkeleton />
            ) : responses.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Response</span>
                    {responses.length > 1 && (
                      <Badge variant="outline">
                        {activeResponseIndex + 1} of {responses.length}
                      </Badge>
                    )}
                  </div>

                  {responses.length > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setActiveResponseIndex((prev) => Math.max(0, prev - 1))}
                        disabled={activeResponseIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setActiveResponseIndex((prev) => Math.min(responses.length - 1, prev + 1))}
                        disabled={activeResponseIndex === responses.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Response</CardTitle>
                        <CardDescription>AI search engine response for "{prompt}"</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: activeResponse.content }}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Metrics</CardTitle>
                        <CardDescription>Brand visibility analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <MetricItem
                            label="Brand Visibility"
                            value={activeResponse.metrics.brandVisibility}
                            max={5}
                            description="How prominently your brand appears"
                          />
                          <MetricItem
                            label="Content Relevance"
                            value={activeResponse.metrics.contentRelevance}
                            max={100}
                            description="How relevant your content is to the query"
                            format="percentage"
                          />
                          <MetricItem
                            label="Citation Rank"
                            value={activeResponse.metrics.citationRank}
                            max={5}
                            description="Position of your content in citations"
                          />
                          <MetricItem
                            label="Competitor Presence"
                            value={activeResponse.metrics.competitorPresence}
                            max={10}
                            description="Number of competitors cited"
                            isInverted
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Citations</CardTitle>
                    <CardDescription>Sources used in the response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeResponse.sources.map((source, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <LinkIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{source.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{source.domain}</p>
                          </div>
                          <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">No responses available</p>
                  <p className="text-sm text-muted-foreground">Click refresh to fetch responses for this query</p>
                  <Button className="mt-4" onClick={handleRefresh} disabled={isLoading}>
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function MetricItem({
  label,
  value,
  max,
  description,
  format = "numeric",
  isInverted = false,
}: {
  label: string
  value: number
  max: number
  description: string
  format?: "numeric" | "percentage"
  isInverted?: boolean
}) {
  const percentage = (value / max) * 100
  const displayValue = format === "percentage" ? `${value}%` : value

  // For inverted metrics (where lower is better)
  const effectivePercentage = isInverted ? 100 - percentage : percentage

  // Determine color based on percentage
  let barColor = "bg-green-500"
  if (isInverted) {
    if (effectivePercentage < 40) barColor = "bg-red-500"
    else if (effectivePercentage < 70) barColor = "bg-yellow-500"
  } else {
    if (effectivePercentage < 40) barColor = "bg-red-500"
    else if (effectivePercentage < 70) barColor = "bg-yellow-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="text-sm font-bold">{displayValue}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

function ResponseSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                <Skeleton className="h-4 w-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4 mt-2" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


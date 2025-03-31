"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Zap, BarChart2, ArrowRight, Microscope, Beaker, Lightbulb } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for target page
const MOCK_TARGET_PAGE = {
  url: "https://example.com/ai-seo-guide",
  title: "AI SEO Guide: Optimizing for AI Search Engines",
  content: `
    <h1>AI SEO Guide: Optimizing for AI Search Engines</h1>
    <p>Learn how to optimize your content for AI search engines like Perplexity, ChatGPT, and more.</p>
    <h2>What is AI SEO?</h2>
    <p>AI SEO refers to optimizing content for AI-powered search engines that use large language models to generate responses.</p>
    <h2>Key Strategies</h2>
    <ul>
      <li>Focus on comprehensive content</li>
      <li>Use clear headings and structure</li>
      <li>Implement schema markup</li>
    </ul>
  `,
  metrics: {
    brandVisibility: 2,
    contentRelevance: 68,
    citationRank: 3,
    competitorPresence: 5,
  },
}

// Mock data for recommendations
const MOCK_RECOMMENDATIONS = {
  content: [
    {
      id: "c1",
      title: "Add more comprehensive answers",
      description:
        "Your content lacks detailed explanations of AI SEO techniques. Expand each section with specific examples and case studies.",
      impact: "high",
      effort: "medium",
    },
    {
      id: "c2",
      title: "Include FAQ section",
      description:
        "Add a dedicated FAQ section addressing common questions about AI SEO to improve chances of being cited.",
      impact: "medium",
      effort: "low",
    },
    {
      id: "c3",
      title: "Add statistics and research data",
      description:
        "Include relevant statistics and research data to increase content authority and citation potential.",
      impact: "high",
      effort: "high",
    },
  ],
  technical: [
    {
      id: "t1",
      title: "Implement schema markup",
      description:
        "Add FAQ schema markup to help AI search engines understand and extract information from your content.",
      impact: "high",
      effort: "medium",
    },
    {
      id: "t2",
      title: "Improve heading structure",
      description: "Use more descriptive H2 and H3 headings that directly answer potential user queries.",
      impact: "medium",
      effort: "low",
    },
    {
      id: "t3",
      title: "Add table of contents",
      description: "Include a table of contents with anchor links to improve content navigation and structure.",
      impact: "medium",
      effort: "low",
    },
  ],
}

// Mock data for optimization techniques
const OPTIMIZATION_TECHNIQUES = [
  {
    id: "expand",
    name: "Content Expansion",
    description: "Expand existing content with more comprehensive information",
  },
  { id: "faq", name: "FAQ Addition", description: "Add frequently asked questions section" },
  {
    id: "headings",
    name: "Heading Restructure",
    description: "Improve heading structure for better content organization",
  },
  { id: "schema", name: "Schema Markup", description: "Add structured data markup for better AI understanding" },
  { id: "examples", name: "Example Addition", description: "Add practical examples and case studies" },
]

// Mock data for optimization results
const MOCK_RESULTS = [
  {
    technique: "Content Expansion",
    improvement: 42,
    beforeMetrics: { brandVisibility: 2, contentRelevance: 68 },
    afterMetrics: { brandVisibility: 4, contentRelevance: 89 },
  },
  {
    technique: "FAQ Addition",
    improvement: 35,
    beforeMetrics: { brandVisibility: 2, contentRelevance: 68 },
    afterMetrics: { brandVisibility: 3, contentRelevance: 82 },
  },
  {
    technique: "Schema Markup",
    improvement: 28,
    beforeMetrics: { brandVisibility: 2, contentRelevance: 68 },
    afterMetrics: { brandVisibility: 3, contentRelevance: 76 },
  },
  {
    technique: "Heading Restructure",
    improvement: 18,
    beforeMetrics: { brandVisibility: 2, contentRelevance: 68 },
    afterMetrics: { brandVisibility: 2, contentRelevance: 74 },
  },
  {
    technique: "Example Addition",
    improvement: 25,
    beforeMetrics: { brandVisibility: 2, contentRelevance: 68 },
    afterMetrics: { brandVisibility: 3, contentRelevance: 78 },
  },
]

export default function OptimizationPage() {
  const params = useParams()
  const prompt = decodeURIComponent(params.prompt as string)
  const [activeTab, setActiveTab] = useState("diagnose")
  const [isLoading, setIsLoading] = useState(false)
  const [targetUrl, setTargetUrl] = useState(MOCK_TARGET_PAGE.url)
  const [selectedTechnique, setSelectedTechnique] = useState("")
  const [selectedResult, setSelectedResult] = useState(MOCK_RESULTS[0])

  const handleRunOptimization = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setActiveTab("results")
    }, 3000)
  }

  return (
    <div className="container py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnose" className="gap-2">
            <Microscope className="h-4 w-4" />
            Diagnose
          </TabsTrigger>
          <TabsTrigger value="enhance" className="gap-2">
            <Beaker className="h-4 w-4" />
            Enhance
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnose" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Target Page</CardTitle>
                  <CardDescription>Page being analyzed for optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">URL</p>
                    <div className="flex items-center gap-2">
                      <Input
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="Enter page URL"
                      />
                      <Button variant="outline" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Title</p>
                    <p className="text-sm">{MOCK_TARGET_PAGE.title}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Content Preview</p>
                    <div className="max-h-48 overflow-y-auto rounded-md border p-3 text-xs">
                      <div dangerouslySetInnerHTML={{ __html: MOCK_TARGET_PAGE.content }} />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Brand Metrics</p>
                    <div className="space-y-2">
                      <MetricItem
                        label="Brand Visibility"
                        value={MOCK_TARGET_PAGE.metrics.brandVisibility}
                        max={5}
                        compact
                      />
                      <MetricItem
                        label="Content Relevance"
                        value={MOCK_TARGET_PAGE.metrics.contentRelevance}
                        max={100}
                        format="percentage"
                        compact
                      />
                    </div>
                    <Button variant="link" className="text-xs p-0 h-auto mt-2">
                      View full metrics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                  <CardDescription>Suggested improvements for better AI search visibility</CardDescription>
                  <Tabs defaultValue="content" className="mt-2">
                    <TabsList>
                      <TabsTrigger value="content" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="technical" className="gap-2">
                        <Zap className="h-4 w-4" />
                        Technical
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-4 space-y-4">
                      <Accordion type="single" collapsible className="w-full">
                        {MOCK_RECOMMENDATIONS.content.map((rec) => (
                          <RecommendationItem key={rec.id} recommendation={rec} />
                        ))}
                      </Accordion>
                    </TabsContent>

                    <TabsContent value="technical" className="mt-4 space-y-4">
                      <Accordion type="single" collapsible className="w-full">
                        {MOCK_RECOMMENDATIONS.technical.map((rec) => (
                          <RecommendationItem key={rec.id} recommendation={rec} />
                        ))}
                      </Accordion>
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="enhance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enhance Content</CardTitle>
              <CardDescription>Apply optimization techniques to improve AI search visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Select Optimization Technique</label>
                <Select value={selectedTechnique} onValueChange={setSelectedTechnique}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a technique" />
                  </SelectTrigger>
                  <SelectContent>
                    {OPTIMIZATION_TECHNIQUES.map((technique) => (
                      <SelectItem key={technique.id} value={technique.id}>
                        <div className="flex items-center gap-2">
                          <span>{technique.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTechnique && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {OPTIMIZATION_TECHNIQUES.find((t) => t.id === selectedTechnique)?.description}
                  </p>
                )}
              </div>

              {selectedTechnique && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Content to Optimize</label>
                    <Textarea
                      rows={8}
                      placeholder="Enter the content you want to optimize..."
                      defaultValue={MOCK_TARGET_PAGE.content}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleRunOptimization} disabled={isLoading} className="gap-2">
                      {isLoading ? (
                        <>
                          <Spinner className="h-4 w-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Beaker className="h-4 w-4" />
                          Run Optimization
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Improvement Metrics</CardTitle>
                  <CardDescription>Effectiveness of each optimization technique</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_RESULTS.map((result) => (
                      <div
                        key={result.technique}
                        className={`relative cursor-pointer p-3 rounded-lg border transition-colors ${
                          selectedResult.technique === result.technique
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">{result.technique}</p>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            +{result.improvement}%
                          </Badge>
                        </div>
                        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${result.improvement}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Before & After Comparison</CardTitle>
                  <CardDescription>{selectedResult.technique} optimization results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">Before Optimization</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-sm">
                        <div className="space-y-2">
                          <p className="font-medium">
                            Brand Visibility: {selectedResult.beforeMetrics.brandVisibility}/5
                          </p>
                          <p className="font-medium">
                            Content Relevance: {selectedResult.beforeMetrics.contentRelevance}%
                          </p>
                          <Separator className="my-3" />
                          <div className="max-h-64 overflow-y-auto">
                            <div dangerouslySetInnerHTML={{ __html: MOCK_TARGET_PAGE.content }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          After Optimization
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Improved</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-sm">
                        <div className="space-y-2">
                          <p className="font-medium flex items-center gap-2">
                            Brand Visibility: {selectedResult.afterMetrics.brandVisibility}/5
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              +
                              {selectedResult.afterMetrics.brandVisibility -
                                selectedResult.beforeMetrics.brandVisibility}
                            </Badge>
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            Content Relevance: {selectedResult.afterMetrics.contentRelevance}%
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              +
                              {selectedResult.afterMetrics.contentRelevance -
                                selectedResult.beforeMetrics.contentRelevance}
                              %
                            </Badge>
                          </p>
                          <Separator className="my-3" />
                          <div className="max-h-64 overflow-y-auto">
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  MOCK_TARGET_PAGE.content +
                                  `
                                <div class="bg-green-50 p-3 rounded-md border border-green-200 mt-4">
                                  <h3 class="text-green-800 font-medium">Added Content</h3>
                                  <p>This is an example of optimized content that would be added based on the ${selectedResult.technique} technique. The actual content would be tailored to your specific page and the selected optimization method.</p>
                                  ${
                                    selectedResult.technique === "FAQ Addition"
                                      ? `
                                    <h3 class="text-green-800 font-medium mt-3">Frequently Asked Questions</h3>
                                    <div>
                                      <p class="font-medium">Q: How is AI SEO different from traditional SEO?</p>
                                      <p>A: AI SEO focuses on optimizing for AI-powered search engines that use large language models to generate responses, while traditional SEO targets keyword-based search engines.</p>
                                    </div>
                                  `
                                      : ""
                                  }
                                </div>
                              `,
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Apply This Optimization
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricItem({
  label,
  value,
  max,
  format = "numeric",
  compact = false,
}: {
  label: string
  value: number
  max: number
  format?: "numeric" | "percentage"
  compact?: boolean
}) {
  const percentage = (value / max) * 100
  const displayValue = format === "percentage" ? `${value}%` : value

  // Determine color based on percentage
  let barColor = "bg-green-500"
  if (percentage < 40) barColor = "bg-red-500"
  else if (percentage < 70) barColor = "bg-yellow-500"

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className={`${compact ? "text-xs" : "text-sm"} font-medium`}>{label}</p>
        <span className={`${compact ? "text-xs" : "text-sm"} font-bold`}>{displayValue}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

function RecommendationItem({ recommendation }: { recommendation: any }) {
  return (
    <AccordionItem value={recommendation.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`
              ${
                recommendation.impact === "high"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : recommendation.impact === "medium"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
              }
            `}
          >
            {recommendation.impact} impact
          </Badge>
          <span>{recommendation.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          <p className="text-sm">{recommendation.description}</p>
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`
                ${
                  recommendation.effort === "high"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : recommendation.effort === "medium"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-green-50 text-green-700 border-green-200"
                }
              `}
            >
              {recommendation.effort} effort
            </Badge>
            <Button size="sm" className="gap-2">
              <Zap className="h-3 w-3" />
              Fix Issue
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function Spinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { pollAnalysisCompletion, startAnalysis, type AnalysisResults, type AnalysisStatus, type Source } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { getStoredRequestId, storeAnalysis } from "@/lib/storage"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, LinkIcon, ArrowUpRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
})

md.renderer.rules.heading_open = (tokens, idx) => {
  const level = tokens[idx].markup.length // number of # characters
  const className = level === 3 ? 'text-xl font-semibold mb-4 mt-6' : 'text-lg font-semibold mb-3 mt-5'
  return `<h${level} class="${className}">`
}

export default function VisibilityPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const prompt = decodeURIComponent(params.prompt as string)
  const requestId = searchParams.get('id')

  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<AnalysisStatus>('pending')
  const [results, setResults] = useState<any | null>(null)

  // Reset state when prompt changes
  useEffect(() => {
    setIsLoading(true)
    setStatus('pending')
    setResults(null)
  }, [prompt])

  const searchEngines = [
    { id: "perplexity", name: "Perplexity", icon: "🔍" },
    { id: "chatgpt", name: "ChatGPT", icon: "🤖", disabled: true },
    { id: "anthropic", name: "Anthropic", icon: "🧠", disabled: true },
    { id: "grok", name: "Grok", icon: "🔮", disabled: true },
    { id: "you", name: "You.com", icon: "🌐", disabled: true },
    { id: "bing", name: "Bing AI", icon: "🔎", disabled: true },
  ]

  const fetchResults = async () => {
    try {
      // If no request ID in URL, check storage
      if (!requestId) {
        const storedId = getStoredRequestId(prompt)
        console.log('Stored ID found:', storedId)
        if (storedId) {
          // We found a stored ID, update URL and return
          router.replace(`/prompts/${encodeURIComponent(prompt)}/visibility?id=${storedId}`, { scroll: false })
          return
        }
        
        // No stored ID, start new analysis
        const response = await startAnalysis({
          prompt: prompt,
          use_cache: true,
          num_completions: 1
        })
        console.log('Started new analysis:', response)
        
        // Store the new analysis and update URL
        storeAnalysis(prompt, response.request_id)
        router.replace(`/prompts/${encodeURIComponent(prompt)}/visibility?id=${response.request_id}`, { scroll: false })
        return
      }

      // We have a request ID (either from URL or storage), poll for results
      console.log('Polling for results with ID:', requestId)
      const data = await pollAnalysisCompletion(
        requestId,
        (newStatus: AnalysisStatus) => {
          console.log('Status update:', newStatus)
          setStatus(newStatus)
        },
        2000,
        30
      )
      console.log('Raw API response:', data)

      // Update the results state with the analysis data
      if (data?.analysis) {
        setResults(data)
        
        // Store successful analysis and update sidebar
        storeAnalysis(prompt, requestId)
        
        // Dispatch custom event to notify sidebar of update
        window.dispatchEvent(new Event('analysisUpdated'))
        
        // Force a refresh of the sidebar by triggering a storage event
        window.localStorage.setItem('lastAnalyzedPrompt', prompt)
        window.dispatchEvent(new Event('storage'))
      }
      
    } catch (error) {
      console.error('Failed to fetch analysis results:', error)
      toast({
        title: "Error",
        description: "Failed to fetch analysis results. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Separate effect for fetching results to avoid race conditions
  useEffect(() => {
    if (requestId || prompt) {
      fetchResults()
    }
  }, [requestId, prompt])

  if (isLoading || status === 'pending' || status === 'processing') {
    console.log('Showing loading state:', { isLoading, status })
    return <LoadingState prompt={prompt} status={status} />
  }

  // Only proceed if we have valid results with analysis data
  if (!results?.analysis) {
    console.log('No valid results available:', results)
    return <NoResultsState prompt={prompt} />
  }

  const content = results.analysis?.perplexity_response?.processed_content
  const sources = results.analysis?.sources || []
  const targetInfo = results.analysis?.target_page_info
  const metrics = results.analysis?.calculated_metrics?.scores || {}
  
  // Format the content to handle markdown and line breaks
  const formattedContent = content ? md.render(
    content
      .replace(/\*\*([^*]+)\*\*/g, '_$1_') // Replace ** with _ for italics
      .replace(/###/g, '### ') // Add space after ### for headers
      .replace(/\[(\d+)\]/g, (match: string, num: string) => {
        return `<span class="text-blue-500 dark:text-blue-400 font-bold">[${num}]</span>`;
      })
  ) : ''

  // Find if target page is in primary sources
  const targetSourceInPrimary = sources.find((source: Source) => 
    source.url === targetInfo?.target_content?.url
  )

  const MetricItem = ({ 
    label, 
    value, 
    description, 
    max = 100,
    showBar = false,
    barColor = "bg-blue-500",
    isInverted = false,
    valueClassName
  }: { 
    label: string, 
    value: number | string | null, 
    description: string,
    max?: number,
    showBar?: boolean,
    barColor?: string,
    isInverted?: boolean,
    valueClassName?: string
  }) => (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <div className="text-base font-semibold">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="w-full">
          {showBar && typeof value === 'number' && (
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${barColor}`} 
                style={{ 
                  width: `${(value / max) * 100}%`,
                  opacity: isInverted ? 0.5 + (1 - value / max) * 0.5 : 1
                }} 
              />
            </div>
          )}
        </div>
        <span className={`text-lg font-semibold tabular-nums ${valueClassName || ''}`}>
          {value !== null ? (typeof value === 'number' ? 
            (showBar ? Math.round(value * 100) + '%' : value) 
            : value) : '0'}
        </span>
      </div>
    </div>
  )
  
  return (
    <div className="container py-6">
      <Tabs defaultValue="perplexity">
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

          <Button variant="outline" size="sm" onClick={() => window.location.reload()} disabled={isLoading}>
            Refresh
          </Button>
        </div>

        <TabsContent value="perplexity" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-[570px] flex flex-col">
                <CardHeader className="pb-2 flex-none">
                  <CardTitle className="text-sm">Response</CardTitle>
                  <CardDescription className="text-xs">AI search engine response for "{prompt}"</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto flex-1 pb-6">
                  <div className="prose prose-xs max-w-none dark:prose-invert">
                    {formattedContent ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: formattedContent }}
                        className="space-y-2 [&>p]:mb-2 [&>p]:leading-relaxed [&>h3]:text-xs [&>h3]:font-semibold [&>h3]:mb-1.5 [&>h3]:mt-3 [&_em]:italic [&_em]:font-normal"
                      />
                    ) : (
                      <div className="text-muted-foreground">No content available.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Metrics</CardTitle>
                  <CardDescription className="text-xs">Brand visibility analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <MetricItem
                      label="Cited"
                      value={targetSourceInPrimary ? "Yes" : "No"}
                      description="Whether your content appears in citations"
                      valueClassName={!targetSourceInPrimary ? "text-red-500" : undefined}
                    />
                    <MetricItem
                      label="Citation Rank"
                      value={targetSourceInPrimary ? targetSourceInPrimary.citation_metadata.order : "-"}
                      description="Position of your content in citations"
                      valueClassName={!targetSourceInPrimary ? "text-red-500" : undefined}
                    />
                    <MetricItem
                      label="Visibility Score"
                      value={targetSourceInPrimary ? 
                        metrics.word_position?.[targetSourceInPrimary.citation_metadata.order - 1] || 0 
                        : 0}
                      description="How visible your content is in the response"
                      showBar={true}
                      barColor="bg-blue-500"
                      valueClassName={!targetSourceInPrimary ? "text-red-500" : undefined}
                    />
                    {(!targetSourceInPrimary || !results.analysis.baseline_metrics.has_target_page) && (
                      <MetricItem
                        label="Google Rank"
                        value={results.analysis.baseline_metrics.has_target_page ? 
                          targetInfo?.target_content?.metadata?.citation_metadata?.order || "-" 
                          : "<25"}
                        description="Position in Google search results"
                        valueClassName="text-red-500"
                      />
                    )}
                    <div className="opacity-50">
                      <MetricItem
                        label="Competitor Presence"
                        value="-"
                        description="Number of competitors cited"
                        showBar={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Citations</CardTitle>
              <CardDescription>Sources referenced in the response</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perplexity Rank</TableHead>
                    <TableHead>Source Details</TableHead>
                    <TableHead>Visibility Score</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((source: Source, index: number) => {
                    const wordPositionScore = metrics.word_position?.[index];
                    const domain = source.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
                    const isTargetSource = source.url === targetInfo?.target_content?.url;
                    
                    return (
                      <TableRow 
                        key={index}
                        className={isTargetSource ? "bg-blue-50 dark:bg-blue-950/30" : ""}
                      >
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className="bg-blue-500 dark:bg-blue-400 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
                          >
                            {source.citation_metadata?.order !== undefined ? source.citation_metadata.order : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold text-base">{domain}</div>
                            <div className="text-sm text-blue-500 dark:text-blue-400 hover:underline truncate">
                              {source.url}
                            </div>
                            <div className="font-medium text-sm">{source.title}</div>
                            {source.description && (
                              <div className="text-sm text-muted-foreground/80 italic line-clamp-2">
                                {source.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {wordPositionScore !== undefined ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-200" 
                                style={{ width: `${wordPositionScore * 100}%` }}
                              />
                              <span className="text-sm font-mono">
                                {(wordPositionScore * 100).toFixed(1)}%
                              </span>
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {targetInfo?.target_page_source === 'secondary' && targetInfo.target_content && (
            <Card>
              <CardHeader>
                <CardTitle>Target Source</CardTitle>
                <CardDescription>Information about your target page from Google results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-base">
                      {targetInfo.target_content.metadata.domain}
                    </div>
                    <div className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
                      {targetInfo.target_content.url}
                    </div>
                    <div className="font-medium text-sm">
                      {targetInfo.target_content.title}
                    </div>
                    {targetInfo.target_content.summary && (
                      <div className="text-sm text-muted-foreground/80 italic">
                        {targetInfo.target_content.summary}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Google Rank:</span>
                    <Badge variant="outline">
                      {targetInfo.target_content.metadata.citation_metadata?.order || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LoadingState({ prompt, status }: { prompt: string; status: AnalysisStatus }) {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Status: {status}</CardTitle>
          <CardDescription>Analyzing prompt: {prompt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NoResultsState({ prompt }: { prompt: string }) {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>No Results</CardTitle>
          <CardDescription>No analysis results available for prompt: {prompt}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}


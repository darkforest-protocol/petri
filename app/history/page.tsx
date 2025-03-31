import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Download } from "lucide-react"

// Mock data for search history
const MOCK_HISTORY = [
  {
    id: 1,
    prompt: "best seo practices for e-commerce",
    date: "2025-03-28T14:30:00Z",
    engines: ["Perplexity"],
    metrics: {
      brandVisibility: 3,
      contentRelevance: 78,
    },
  },
  {
    id: 2,
    prompt: "how to optimize content for featured snippets",
    date: "2025-03-27T10:15:00Z",
    engines: ["Perplexity"],
    metrics: {
      brandVisibility: 2,
      contentRelevance: 65,
    },
  },
  {
    id: 3,
    prompt: "ai search engine ranking factors",
    date: "2025-03-25T16:45:00Z",
    engines: ["Perplexity"],
    metrics: {
      brandVisibility: 4,
      contentRelevance: 92,
    },
  },
  {
    id: 4,
    prompt: "structured data for better visibility",
    date: "2025-03-23T09:20:00Z",
    engines: ["Perplexity"],
    metrics: {
      brandVisibility: 1,
      contentRelevance: 54,
    },
  },
  {
    id: 5,
    prompt: "keyword research for ai search",
    date: "2025-03-20T13:10:00Z",
    engines: ["Perplexity"],
    metrics: {
      brandVisibility: 0,
      contentRelevance: 42,
    },
  },
]

export default function HistoryPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Search History</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Filter by Date
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search history..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Searches</TabsTrigger>
          <TabsTrigger value="optimized">Optimized</TabsTrigger>
          <TabsTrigger value="unoptimized">Unoptimized</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {MOCK_HISTORY.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimized" className="mt-0">
          <div className="space-y-4">
            {MOCK_HISTORY.filter((item) => item.metrics.brandVisibility >= 3).map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unoptimized" className="mt-0">
          <div className="space-y-4">
            {MOCK_HISTORY.filter((item) => item.metrics.brandVisibility < 3).map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HistoryItem({ item }: { item: any }) {
  const date = new Date(item.date)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Determine badge color based on brand visibility
  let badgeColor = "bg-red-50 text-red-700 border-red-200"
  if (item.metrics.brandVisibility >= 4) {
    badgeColor = "bg-green-50 text-green-700 border-green-200"
  } else if (item.metrics.brandVisibility >= 2) {
    badgeColor = "bg-yellow-50 text-yellow-700 border-yellow-200"
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">
              <a href={`/prompts/${encodeURIComponent(item.prompt)}/visibility`} className="hover:underline">
                {item.prompt}
              </a>
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{item.engines.join(", ")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${badgeColor}`}>
              Visibility: {item.metrics.brandVisibility}/5
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={`/prompts/${encodeURIComponent(item.prompt)}/visibility`}>View</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


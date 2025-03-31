"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Search, FlaskRoundIcon as Flask, History, Settings, ChevronRight, Beaker } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock data for recent prompts
const MOCK_RECENT_PROMPTS = [
  "best seo practices for e-commerce",
  "how to optimize content for featured snippets",
  "ai search engine ranking factors",
  "structured data for better visibility",
  "keyword research for ai search",
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [recentPrompts, setRecentPrompts] = useState<string[]>(MOCK_RECENT_PROMPTS)
  const [searchTerm, setSearchTerm] = useState("")

  // Extract current prompt from URL if on a prompt page
  const currentPromptMatch = pathname?.match(/\/prompts\/([^/]+)/)
  const currentPrompt = currentPromptMatch ? decodeURIComponent(currentPromptMatch[1]) : null

  // Add current prompt to recent prompts if it's new
  useEffect(() => {
    if (currentPrompt && !recentPrompts.includes(currentPrompt)) {
      setRecentPrompts((prev) => [currentPrompt, ...prev].slice(0, 10))
    }
  }, [currentPrompt, recentPrompts])

  // Filter prompts based on search term
  const filteredPrompts = searchTerm
    ? recentPrompts.filter((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
    : recentPrompts

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Flask className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Petri</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/history"}>
                  <Link href="/history">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Prompts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredPrompts.length > 0 ? (
                filteredPrompts.map((prompt) => (
                  <SidebarMenuItem key={prompt}>
                    <SidebarMenuButton asChild isActive={currentPrompt === prompt}>
                      <Link href={`/prompts/${encodeURIComponent(prompt)}/visibility`}>
                        <Beaker className="h-4 w-4" />
                        <span>{prompt}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">No prompts found</div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <span className="text-xs font-bold">P</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Petri Labs</p>
            <p className="text-xs text-muted-foreground truncate">Free Plan</p>
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarTrigger />
    </Sidebar>
  )
}


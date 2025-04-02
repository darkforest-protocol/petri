"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Search, FlaskRoundIcon as Flask, History, Settings, ChevronRight, Beaker, Trash2 } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { getStoredAnalyses, removeAnalysis } from "@/lib/storage"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [analyses, setAnalyses] = useState<Array<{ prompt: string; requestId: string }>>([])

  // Initialize analyses from localStorage on client side only
  useEffect(() => {
    const updateAnalyses = () => {
      setAnalyses(getStoredAnalyses())
    }

    // Initial load
    updateAnalyses()

    // Listen for storage events (both from other tabs and our custom event)
    window.addEventListener('storage', updateAnalyses)
    window.addEventListener('analysisUpdated', updateAnalyses)

    // Listen for route changes to refresh analyses
    const handleRouteChange = () => {
      updateAnalyses()
    }
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('storage', updateAnalyses)
      window.removeEventListener('analysisUpdated', updateAnalyses)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  const handleDelete = (prompt: string) => {
    removeAnalysis(prompt)
    setAnalyses(getStoredAnalyses())
  }

  // Filter analyses based on search term
  const filteredAnalyses = searchTerm
    ? analyses.filter(({ prompt }) => prompt.toLowerCase().includes(searchTerm.toLowerCase()))
    : analyses

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Flask className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Petri</span>
        </Link>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="mt-4">
          <Button variant="default" className="w-full justify-start gap-2" onClick={() => router.push("/")}>
            <Search className="h-4 w-4" />
            New Search
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Prompts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredAnalyses.length > 0 ? (
                filteredAnalyses.map(({ prompt, requestId }) => (
                  <SidebarMenuItem key={requestId} className="group/menu-item relative">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/prompts/${encodeURIComponent(prompt)}/visibility`}
                      className="pr-10"
                    >
                      <Link href={`/prompts/${encodeURIComponent(prompt)}/visibility?id=${requestId}`}>
                        <Beaker className="h-4 w-4" />
                        <span>{prompt}</span>
                      </Link>
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(prompt);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-muted-foreground">No prompts yet</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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


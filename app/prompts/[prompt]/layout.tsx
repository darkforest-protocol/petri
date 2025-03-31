"use client"

import type React from "react"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PromptLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const prompt = decodeURIComponent(params.prompt as string)

  const isVisibilityActive = pathname?.includes("/visibility")
  const isOptimizationActive = pathname?.includes("/optimization")

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="container py-4">
          <h1 className="text-2xl font-bold truncate">{prompt}</h1>

          <Tabs defaultValue={isVisibilityActive ? "visibility" : "optimization"} className="mt-4">
            <TabsList>
              <TabsTrigger value="visibility" asChild>
                <Link href={`/prompts/${encodeURIComponent(prompt as string)}/visibility`}>
                  <BarChartIcon className="mr-2 h-4 w-4" />
                  Visibility
                </Link>
              </TabsTrigger>
              <TabsTrigger value="optimization" asChild>
                <Link href={`/prompts/${encodeURIComponent(prompt as string)}/optimization`}>
                  <ZapIcon className="mr-2 h-4 w-4" />
                  Optimization
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}


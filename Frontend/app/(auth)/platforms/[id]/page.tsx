'use client'

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { X } from 'lucide-react'
import { Twitter, Instagram, Facebook, Linkedin, Github, Youtube, Twitch, TwitterIcon as TikTok, Globe } from 'lucide-react'

const PLATFORMS = [
  { id: "twitter", name: "Twitter", icon: Twitter },
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "github", name: "GitHub", icon: Github },
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "twitch", name: "Twitch", icon: Twitch },
  { id: "tiktok", name: "TikTok", icon: TikTok },
  { id: "website", name: "Website", icon: Globe },
]

export default function PlatformSelection() {
  const { toast } = useToast()
  const router = useRouter()
  const { id } = useParams();

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlatforms = PLATFORMS.filter((platform) =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsPending(true)
    alert(selectedPlatforms)

    try {
      const response = await fetch(`http://localhost:3003/api/updateplatform/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platforms: selectedPlatforms }),
      })

      if (!response.ok) {
        throw new Error('Failed to update platforms')
      }

      const data = await response.json()

      router.push("/dashboard")
    } catch (error) {
      console.error('Error updating platforms:', error)
      toast({
        title: "Error",
        description: "Failed to update platforms. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((current) =>
      current.includes(platformId)
        ? current.filter((id) => id !== platformId)
        : [...current, platformId]
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect Your Platforms</CardTitle>
          <CardDescription>
            Select the social media platforms you want to connect with
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Selected Platforms */}
            <div className="flex flex-wrap gap-2">
              {selectedPlatforms.length > 0 ? (
                selectedPlatforms.map((platform) => {
                  const platformData = PLATFORMS.find((p) => p.id === platform)
                  if (!platformData) return null
                  const Icon = platformData.icon
                  return (
                    <Badge
                      key={platform}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      <Icon className="h-4 w-4" />
                      {platformData.name}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => togglePlatform(platform)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">
                          Remove {platformData.name}
                        </span>
                      </button>
                    </Badge>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No platforms selected. Choose from the list below.
                </p>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search platforms..."
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filteredPlatforms.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatforms.includes(platform.id)
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{platform.name}</span>
                    {isSelected && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || selectedPlatforms.length === 0}
            >
              {isPending ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                "Continue"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              You can add or remove platforms anytime.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


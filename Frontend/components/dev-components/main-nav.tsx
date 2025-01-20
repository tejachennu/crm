import { BarChart, FileText, Users, Settings, HelpCircle, Layout, Calendar, MessageSquare } from 'lucide-react'

export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Layout,
    description: "Overview of your activity"
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
    description: "View your statistics"
  },
  {
    title: "Posts",
    href: "/posts",
    icon: FileText,
    description: "Manage your content"
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Schedule your posts"
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    description: "View your messages"
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    description: "Manage your team"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your preferences"
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Get support"
  },
]


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Scissors, 
  Star, 
  Calendar, 
  TrendingUp, 
  Image as ImageIcon,
  Award,
  MapPin,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

interface PortfolioItem {
  id: string
  image: string
  title: string
  description: string
  tags: string[]
  date: string
  likes: number
}

const mockPortfolioItems: PortfolioItem[] = [
  {
    id: "1",
    image: "/api/placeholder/400/500",
    title: "Classic Skin Fade",
    description: "Clean fade with sharp line work",
    tags: ["Skin Fade", "Line Up", "Premium"],
    date: "2024-01-15",
    likes: 42,
  },
  {
    id: "2",
    image: "/api/placeholder/400/500",
    title: "Textured Crop",
    description: "Modern textured cut with natural flow",
    tags: ["Textured", "Modern", "Styling"],
    date: "2024-01-12",
    likes: 38,
  },
  {
    id: "3",
    image: "/api/placeholder/400/500",
    title: "Design Fade",
    description: "Custom design with precision fade",
    tags: ["Design", "Fade", "Custom"],
    date: "2024-01-10",
    likes: 56,
  },
  {
    id: "4",
    image: "/api/placeholder/400/500",
    title: "Taper Fade",
    description: "Professional taper with clean finish",
    tags: ["Taper", "Professional", "Clean"],
    date: "2024-01-08",
    likes: 29,
  },
  {
    id: "5",
    image: "/api/placeholder/400/500",
    title: "Long Hair Styling",
    description: "Elegant long hair cut and styling",
    tags: ["Long Hair", "Styling", "Elegant"],
    date: "2024-01-05",
    likes: 33,
  },
  {
    id: "6",
    image: "/api/placeholder/400/500",
    title: "Beard Trim & Shape",
    description: "Precision beard shaping and trimming",
    tags: ["Beard", "Trim", "Shape"],
    date: "2024-01-03",
    likes: 47,
  },
]

export default function BarberPortfolioPage() {
  const stats = {
    totalCuts: 247,
    averageRating: 4.9,
    totalReviews: 89,
    monthlyEarnings: 5420,
    upcomingAppointments: 12,
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Showcase your work and build your brand</p>
        </div>
        <Button className="w-full md:w-auto">
          <ImageIcon className="h-4 w-4 mr-2" />
          Upload New Work
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cuts</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCuts}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">{stats.totalReviews} reviews</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Your public profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-1">Location</p>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Elite Cuts Barbershop, Downtown</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Availability</p>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Mon-Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Experience</p>
              <p className="text-muted-foreground">5+ years professional barbering</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Specializations</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground">
                  Skin Fade
                </span>
                <span className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground">
                  Design Work
                </span>
                <span className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground">
                  Beard Styling
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Gallery */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Work Gallery</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Recent</Button>
            <Button variant="outline" size="sm">Popular</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockPortfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">✂️</div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                    <span className="text-xs font-medium text-foreground">{item.likes} ❤️</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}


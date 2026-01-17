"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Star, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"

interface Shop {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  reviewCount: number
  image: string
  specialties: string[]
  openHours: string
  barbersCount: number
}

const mockShops: Shop[] = [
  {
    id: "1",
    name: "Elite Cuts Barbershop",
    address: "123 Main St, Downtown",
    distance: "0.8 mi",
    rating: 4.9,
    reviewCount: 127,
    image: "/api/placeholder/400/300",
    specialties: ["Fade", "Line Up", "Beard Trim"],
    openHours: "9:00 AM - 7:00 PM",
    barbersCount: 5,
  },
  {
    id: "2",
    name: "Precision Barbers",
    address: "456 Oak Ave, Midtown",
    distance: "1.2 mi",
    rating: 4.7,
    reviewCount: 89,
    image: "/api/placeholder/400/300",
    specialties: ["Skin Fade", "Taper", "Design"],
    openHours: "8:00 AM - 6:00 PM",
    barbersCount: 4,
  },
  {
    id: "3",
    name: "The Gentleman's Cut",
    address: "789 Elm Blvd, Uptown",
    distance: "2.1 mi",
    rating: 4.8,
    reviewCount: 156,
    image: "/api/placeholder/400/300",
    specialties: ["Classic Cut", "Hot Towel", "Straight Razor"],
    openHours: "10:00 AM - 8:00 PM",
    barbersCount: 6,
  },
  {
    id: "4",
    name: "Urban Fade Studio",
    address: "321 Pine St, Arts District",
    distance: "1.5 mi",
    rating: 4.6,
    reviewCount: 94,
    image: "/api/placeholder/400/300",
    specialties: ["Fade", "Color", "Design"],
    openHours: "9:00 AM - 7:00 PM",
    barbersCount: 3,
  },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)

  const specialties = ["Fade", "Skin Fade", "Taper", "Line Up", "Beard Trim", "Design", "Color"]

  const filteredShops = mockShops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = !selectedSpecialty || shop.specialties.includes(selectedSpecialty)
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Discover Shops</h1>
        <p className="text-muted-foreground">Find the perfect barbershop near you</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSpecialty === specialty
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Shop Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredShops.map((shop, index) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">💇</div>
                </div>
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                  <span className="text-xs font-medium text-foreground">{shop.distance}</span>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{shop.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {shop.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-primary fill-primary mr-1" />
                    <span className="font-medium">{shop.rating}</span>
                    <span className="text-muted-foreground ml-1">({shop.reviewCount})</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {shop.barbersCount} barbers
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {shop.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {shop.openHours}
                  </div>
                  <Button className="w-full" variant="default">
                    View Shop & Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No shops found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}


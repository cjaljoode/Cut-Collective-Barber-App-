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
    specialties: ["Classic Cut", "Hot Towel", "Straight Razor"],
    openHours: "10:00 AM - 8:00 PM",
    barbersCount: 6,
  },
]

export default function CustomerDiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredShops = mockShops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Discover Shops</h1>
        <p className="text-muted-foreground">Find the perfect barbershop near you</p>
      </div>

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredShops.map((shop, index) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">💇</div>
                </div>
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                  <span className="text-xs font-medium text-foreground">{shop.distance}</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl mb-1">{shop.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {shop.address}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-primary fill-primary mr-1" />
                    <span className="font-medium">{shop.rating}</span>
                    <span className="text-muted-foreground ml-1">({shop.reviewCount})</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {shop.barbersCount}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
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
                </div>
                <Button className="w-full mt-4">View Shop & Book</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


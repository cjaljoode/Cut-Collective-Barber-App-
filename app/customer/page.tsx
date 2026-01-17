"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Star, TrendingUp, Bell } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CustomerHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">Find your perfect cut and book with top barbers</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Discover Shops</CardTitle>
              <CardDescription>Find barbershops near you</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/customer/discover">
                <Button className="w-full">Explore</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>Schedule your next cut</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/customer/book">
                <Button className="w-full">Book Now</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Trending Styles</CardTitle>
              <CardDescription>See what's popular</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/customer/discover">
                <Button className="w-full" variant="outline">View Trends</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Reminders</CardTitle>
              <CardDescription>Manage appointment alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/customer/reminders">
                <Button className="w-full" variant="outline">Customize</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">Elite Cuts Barbershop</p>
                <p className="text-sm text-muted-foreground">Today at 2:00 PM</p>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">Precision Barbers</p>
                <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium">4.7</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


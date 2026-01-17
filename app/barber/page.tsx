"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, Scissors, DollarSign, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import { BreakStatusControl } from "@/components/barber/break-status"

type BreakStatus = "available" | "on_break" | "break_requested" | "busy"

export default function BarberDashboardPage() {
  const [breakStatus, setBreakStatus] = useState<BreakStatus>("available")
  const [canSelfBreak, setCanSelfBreak] = useState(false) // Set to true if barber has permission to self-break

  const stats = {
    todayAppointments: 8,
    completed: 5,
    earnings: 247,
    averageRating: 4.9,
    nextAppointment: "2:00 PM",
    clientsToday: 5,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Barber Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your day at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">{stats.completed} completed</p>
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
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.earnings}</div>
              <p className="text-xs text-muted-foreground">From {stats.completed} cuts</p>
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
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Based on 89 reviews</p>
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
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nextAppointment}</div>
              <p className="text-xs text-muted-foreground">John Smith</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Today's Schedule */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "9:00 AM", client: "Mike Johnson", service: "Haircut + Beard", status: "completed" },
                { time: "10:30 AM", client: "David Lee", service: "Fade", status: "completed" },
                { time: "12:00 PM", client: "Chris Brown", service: "Line Up", status: "completed" },
                { time: "2:00 PM", client: "John Smith", service: "Haircut", status: "upcoming" },
                { time: "3:30 PM", client: "Alex Wilson", service: "Beard Trim", status: "upcoming" },
              ].map((apt, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    apt.status === "completed"
                      ? "bg-secondary/50 border-border"
                      : apt.status === "upcoming"
                      ? "bg-primary/10 border-primary/50"
                      : "border-border"
                  }`}
                >
                  <div>
                    <p className="font-medium text-foreground">{apt.time}</p>
                    <p className="text-sm text-muted-foreground">{apt.client}</p>
                    <p className="text-xs text-muted-foreground">{apt.service}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center">
                <Scissors className="h-4 w-4 mr-2" />
                Mark Appointment Complete
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center">
                <Users className="h-4 w-4 mr-2" />
                View Client History
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upload Work Photo
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Break Status Control */}
      <div className="grid gap-4 md:grid-cols-2">
        <BreakStatusControl
          currentStatus={breakStatus}
          onStatusChange={setBreakStatus}
          canSelfBreak={canSelfBreak}
          barberId="barber_1" // In real app, this would come from auth/user context
          barberName="John Doe" // In real app, this would come from user profile
        />
      </div>
    </div>
  )
}


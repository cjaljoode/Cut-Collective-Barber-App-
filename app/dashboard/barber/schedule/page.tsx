"use client"

import { useEffect, useMemo, useState } from "react"
import { format, isSameDay, startOfDay, differenceInMinutes } from "date-fns"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createSupabaseClient } from "@/lib/supabase"

type AppointmentStatus = "scheduled" | "completed" | "cancelled"

interface Appointment {
  id: string
  start_time: string
  status: AppointmentStatus
  client?: {
    full_name: string | null
    avatar_url: string | null
  }
  service?: {
    name: string | null
    price: number | null
    duration_minutes: number | null
  }
}

export default function BarberSchedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const supabase = createSupabaseClient()

  const today = new Date()
  const isToday = isSameDay(selectedDate, today)

  const upcomingAppointment = useMemo(() => {
    const now = new Date()
    return appointments.find(
      (appt) => appt.status === "scheduled" && new Date(appt.start_time) > now
    )
  }, [appointments])

  const timeUntilNext = useMemo(() => {
    if (!upcomingAppointment) return null
    const minutes = differenceInMinutes(
      new Date(upcomingAppointment.start_time),
      new Date()
    )
    return minutes > 0 ? minutes : 0
  }, [upcomingAppointment])

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null
    let isMounted = true

    const init = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      await fetchAppointments(user.id)

      channel = supabase
        .channel(`appointments-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "appointments",
            filter: `barber_id=eq.${user.id}`,
          },
          () => {
            if (isMounted) fetchAppointments(user.id)
          }
        )
        .subscribe()
    }

    init()

    return () => {
      isMounted = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedDate])

  const fetchAppointments = async (userId: string) => {
    const start = startOfDay(selectedDate).toISOString()
    const end = new Date(startOfDay(selectedDate).getTime() + 86400000).toISOString()

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        start_time,
        status,
        client:profiles!appointments_client_id_fkey(full_name, avatar_url),
        service:services(name, price, duration_minutes)
      `
      )
      .eq("barber_id", userId)
      .gte("start_time", start)
      .lt("start_time", end)
      .order("start_time", { ascending: true })

    if (error) {
      setStatusMessage("Error fetching schedule.")
    } else {
      setAppointments((data || []) as Appointment[])
      setStatusMessage(null)
    }
    setLoading(false)
  }

  const updateStatus = async (
    id: string,
    status: "completed" | "cancelled"
  ) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)

    if (error) {
      setStatusMessage("Update failed.")
    } else {
      setStatusMessage(`Appointment ${status}.`)
      if (status === "completed") {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-4">
            <CalendarIcon className="text-amber-500 w-5 h-5" />
            <h1 className="text-xl font-bold uppercase tracking-tight">
              {format(selectedDate, "MMMM do, yyyy")}
            </h1>
            {isToday && (
              <Badge className="bg-amber-500/10 text-amber-500 uppercase text-[10px]">
                Today
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-800"
              onClick={() =>
                setSelectedDate(
                  new Date(selectedDate.setDate(selectedDate.getDate() - 1))
                )
              }
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 bg-zinc-900 text-xs uppercase"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-800"
              onClick={() =>
                setSelectedDate(
                  new Date(selectedDate.setDate(selectedDate.getDate() + 1))
                )
              }
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Countdown */}
        {upcomingAppointment && timeUntilNext !== null && (
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm text-zinc-400">Next appointment</p>
              <p className="text-white font-semibold">
                Starts in {timeUntilNext} min
              </p>
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="text-sm text-amber-400">{statusMessage}</div>
        )}

        {/* Timeline View */}
        <div className="relative space-y-4">
          {loading ? (
            <p className="text-center text-zinc-500 py-10">Loading your craft...</p>
          ) : appointments.length > 0 ? (
            appointments.map((app) => (
              <div key={app.id} className="relative pl-8 group">
                {/* Timeline Line */}
                <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-zinc-800 group-last:h-12" />
                <div className="absolute left-0 top-6 w-6 h-6 rounded-full bg-black border-2 border-amber-500 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>

                <Card
                  className={`bg-zinc-900/40 border-zinc-800 hover:border-amber-500/30 transition-all rounded-none ${
                    app.status === "completed" ? "opacity-50" : ""
                  }`}
                >
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-black text-amber-500">
                          {format(new Date(app.start_time), "h:mm")}
                        </p>
                        <p className="text-[10px] uppercase text-zinc-500 font-bold">
                          {format(new Date(app.start_time), "a")}
                        </p>
                      </div>
                      <div className="h-10 w-[1px] bg-zinc-800 hidden md:block" />
                      <div>
                        <h3 className="text-white font-bold flex items-center gap-2">
                          {app.client?.full_name || "Guest Client"}
                          {app.status === "completed" && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {app.service?.name} • {app.service?.duration_minutes}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t border-zinc-800 pt-4 md:border-0 md:pt-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          ${app.service?.price ?? 0}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase tracking-widest ${
                            app.status === "scheduled"
                              ? "text-amber-500 border-amber-500/30"
                              : "text-zinc-500 border-zinc-800"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-zinc-800 text-zinc-300"
                          onClick={() => updateStatus(app.id, "completed")}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          className="border-zinc-800 text-red-400"
                          onClick={() => updateStatus(app.id, "cancelled")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-xl">
              <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-zinc-400 font-medium">
                No appointments scheduled for this day.
              </h3>
              <p className="text-zinc-600 text-sm">Time to sharpen those shears!</p>
            </div>
          )}
        </div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-4 bg-amber-500 opacity-80"
              style={{
                left: `${(i * 4) % 100}%`,
                top: "-10%",
                animation: `confetti-fall 1.5s ease-in ${i * 0.05}s`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes confetti-fall {
              0% {
                transform: translateY(0) rotate(0deg);
              }
              100% {
                transform: translateY(120vh) rotate(320deg);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

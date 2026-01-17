"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, CheckCircle, Clock, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createSupabaseClient } from "@/lib/supabase"

interface Service {
  id: string
  name: string
  price: number
  duration_minutes: number
}

interface BookingModalProps {
  displayName: string | null | undefined
  services: Service[]
  barberId?: string | null
  shopId?: string | null
}

interface AppointmentSlot {
  start: Date
  end: Date
}

const SLOT_INTERVAL_MINUTES = 30
const START_HOUR = 9
const END_HOUR = 18

function parseTimeLabel(label: string) {
  const [time, modifier] = label.split(" ")
  const [rawHour, rawMinute] = time.split(":").map(Number)
  let hour = rawHour % 12
  if (modifier === "PM") hour += 12
  return { hour, minute: rawMinute }
}

function formatSlotLabel(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

function buildGoogleCalendarUrl({
  title,
  start,
  end,
}: {
  title: string
  start: Date
  end: Date
}) {
  const toGCal = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGCal(start)}/${toGCal(end)}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function BookingModal({
  displayName,
  services,
  barberId,
  shopId,
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [busySlots, setBusySlots] = useState<AppointmentSlot[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successLink, setSuccessLink] = useState<string | null>(null)

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId]
  )

  const timeSlots = useMemo(() => {
    if (!selectedDate) return []
    const slots: Date[] = []
    const start = new Date(selectedDate)
    start.setHours(START_HOUR, 0, 0, 0)
    const end = new Date(selectedDate)
    end.setHours(END_HOUR, 0, 0, 0)

    const current = new Date(start)
    while (current <= end) {
      slots.push(new Date(current))
      current.setMinutes(current.getMinutes() + SLOT_INTERVAL_MINUTES)
    }
    return slots
  }, [selectedDate])

  const isSlotDisabled = (slot: Date) => {
    if (!selectedService) return true
    const now = new Date()
    const slotEnd = new Date(slot.getTime())
    slotEnd.setMinutes(slotEnd.getMinutes() + selectedService.duration_minutes)

    if (slot < now) return true

    return busySlots.some(
      (appt) => slot < appt.end && slotEnd > appt.start
    )
  }

  const fetchAppointments = async (date: Date) => {
    setIsLoadingSlots(true)
    setError(null)
    try {
      const supabase = createSupabaseClient()
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)

      let query = supabase
        .from("appointments")
        .select("start_time, service:services(duration_minutes)")
        .eq("status", "scheduled")
        .gte("start_time", start.toISOString())
        .lte("start_time", end.toISOString())

      if (barberId) query = query.eq("barber_id", barberId)
      if (shopId) query = query.eq("shop_id", shopId)

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError

      const slots =
        data?.map((item) => {
          const startTime = new Date(item.start_time as string)
          const duration = (item.service as { duration_minutes?: number })?.duration_minutes || 30
          const endTime = new Date(startTime.getTime())
          endTime.setMinutes(endTime.getMinutes() + duration)
          return { start: startTime, end: endTime }
        }) || []
      setBusySlots(slots)
    } catch (err) {
      setError("Unable to load availability. Please try again.")
      setBusySlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleSelectDate = (date?: Date) => {
    setSelectedDate(date)
    setSelectedTime("")
    setBusySlots([])
    if (date) {
      fetchAppointments(date)
    }
  }

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return
    if (!barberId && !shopId) {
      setError("Booking destination missing. Please try another profile.")
      return
    }

    try {
      setError(null)
      const supabase = createSupabaseClient()
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) {
        setError("Please sign in to book an appointment.")
        return
      }

      const { hour, minute } = parseTimeLabel(selectedTime)
      const startTime = new Date(selectedDate)
      startTime.setHours(hour, minute, 0, 0)

      const { error: insertError } = await supabase.from("appointments").insert({
        shop_id: shopId || null,
        barber_id: barberId || null,
        client_id: userId,
        service_id: selectedService.id,
        start_time: startTime.toISOString(),
        status: "scheduled",
      })

      if (insertError) throw insertError

      const endTime = new Date(startTime.getTime())
      endTime.setMinutes(endTime.getMinutes() + selectedService.duration_minutes)
      setSuccessLink(
        buildGoogleCalendarUrl({
          title: `Appointment with ${displayName || "The Cut Collective"}`,
          start: startTime,
          end: endTime,
        })
      )
      setSuccess(true)
    } catch (err) {
      setError("Unable to confirm booking. Please try again.")
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedServiceId("")
    setSelectedDate(undefined)
    setSelectedTime("")
    setBusySlots([])
    setError(null)
    setSuccess(false)
    setSuccessLink(null)
  }

  return (
    <>
      <Button
        size="lg"
        onClick={() => setIsOpen(true)}
        className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase px-8 py-6 rounded-none transition-transform active:scale-95"
      >
        Book Now
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-3xl"
            >
              <Card className="bg-zinc-950 text-white border-zinc-800 rounded-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-amber-500" />
                    Book with {displayName || "The Cut Collective"}
                  </CardTitle>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-zinc-800 rounded-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!success ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Service</label>
                        <select
                          value={selectedServiceId}
                          onChange={(e) => setSelectedServiceId(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white"
                        >
                          <option value="">Select service</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name} • ${service.price} • {service.duration_minutes}m
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Calendar
                          selected={selectedDate}
                          onSelect={handleSelectDate}
                          minDate={new Date()}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Time</label>
                          {isLoadingSlots && (
                            <span className="text-xs text-zinc-500">Checking availability…</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((slot) => {
                            const label = formatSlotLabel(slot)
                            const disabled = isSlotDisabled(slot)
                            return (
                              <button
                                key={label}
                                onClick={() => setSelectedTime(label)}
                                disabled={disabled}
                                className={`px-3 py-2 border text-sm ${
                                  selectedTime === label
                                    ? "bg-amber-500 text-black border-amber-500"
                                    : "bg-zinc-900 border-zinc-800 text-white hover:border-amber-500/60"
                                } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                              >
                                {label}
                              </button>
                            )
                          })}
                        </div>
                        {selectedService && (
                          <div className="text-xs text-zinc-500 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Estimated time: {selectedService.duration_minutes} minutes
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="text-sm text-red-400">{error}</div>
                      )}

                      <Button
                        onClick={handleConfirm}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase rounded-none"
                        disabled={
                          !selectedServiceId || !selectedDate || !selectedTime
                        }
                      >
                        Confirm Booking
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <CheckCircle className="w-12 h-12 text-amber-500 mb-4" />
                      <p className="text-lg font-bold">Booking Confirmed</p>
                      <p className="text-zinc-400 text-sm mt-1">
                        Your appointment has been scheduled.
                      </p>
                      {successLink && (
                        <a
                          href={successLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center justify-center border border-amber-500 text-amber-500 px-4 py-2 text-sm font-semibold uppercase"
                        >
                          Add to Google Calendar
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

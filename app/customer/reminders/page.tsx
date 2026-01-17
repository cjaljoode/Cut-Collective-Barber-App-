"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Mail, Smartphone, Repeat } from "lucide-react"
import { motion } from "framer-motion"

type Recurrence = "off" | "weekly" | "biweekly" | "monthly"

interface ReminderPreferences {
  reminderHours: number
  channels: {
    email: boolean
    push: boolean
  }
  recurrence: Recurrence
}

const STORAGE_KEY = "customer_reminder_preferences"

const defaultPreferences: ReminderPreferences = {
  reminderHours: 2,
  channels: {
    email: true,
    push: true,
  },
  recurrence: "monthly",
}

const mockNextAppointment = new Date(Date.now() + 1000 * 60 * 60 * 26)
const mockLastAppointment = new Date(Date.now() - 1000 * 60 * 60 * 24 * 20)

function formatDateTime(date: Date) {
  return date.toLocaleString()
}

function getNextRecurrenceDate(lastDate: Date, recurrence: Recurrence): Date | null {
  if (recurrence === "off") return null

  const next = new Date(lastDate.getTime())
  if (recurrence === "weekly") next.setDate(next.getDate() + 7)
  if (recurrence === "biweekly") next.setDate(next.getDate() + 14)
  if (recurrence === "monthly") next.setMonth(next.getMonth() + 1)
  return next
}

export default function CustomerRemindersPage() {
  const [preferences, setPreferences] = useState<ReminderPreferences>(defaultPreferences)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ReminderPreferences
        setPreferences(parsed)
      } catch {
        setPreferences(defaultPreferences)
      }
    }
  }, [])

  const nextAppointmentReminder = useMemo(() => {
    const reminderTime = new Date(mockNextAppointment.getTime())
    reminderTime.setHours(reminderTime.getHours() - preferences.reminderHours)
    return reminderTime
  }, [preferences.reminderHours])

  const nextBookAgainReminder = useMemo(() => {
    return getNextRecurrenceDate(mockLastAppointment, preferences.recurrence)
  }, [preferences.recurrence])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      setIsSaving(false)
      setLastSaved(new Date())
    }, 500)
  }

  const handleSendTest = (type: "appointment" | "book_again") => {
    const channelList = [
      preferences.channels.email ? "email" : null,
      preferences.channels.push ? "push" : null,
    ].filter(Boolean)

    const channelText = channelList.length > 0 ? channelList.join(" + ") : "no channels"
    const message =
      type === "appointment"
        ? `Sending appointment reminder via ${channelText}.`
        : `Sending book-again reminder via ${channelText}.`

    alert(message)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Reminders</h1>
        <p className="text-muted-foreground">
          Customize how and when you receive appointment and booking reminders.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Appointment Reminders
              </CardTitle>
              <CardDescription>
                Send reminders to you and your barber before the appointment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reminder Timing (hours before appointment)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={1}
                    max={48}
                    value={preferences.reminderHours}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        reminderHours: Number(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {preferences.reminderHours}h
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Channels</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.channels.email}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          channels: {
                            ...preferences.channels,
                            email: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Email reminders</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.channels.push}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          channels: {
                            ...preferences.channels,
                            push: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Push notifications</span>
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  Next appointment: {formatDateTime(mockNextAppointment)}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  Reminder scheduled: {formatDateTime(nextAppointmentReminder)}
                </p>
              </div>

              <Button variant="outline" onClick={() => handleSendTest("appointment")}>
                Send Test Reminder
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Repeat className="h-5 w-5 mr-2" />
                Book Again Reminders
              </CardTitle>
              <CardDescription>
                Get reminders to book your next appointment based on your preference.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Reminder Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["off", "weekly", "biweekly", "monthly"] as Recurrence[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => setPreferences({ ...preferences, recurrence: option })}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        preferences.recurrence === option
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-accent"
                      }`}
                    >
                      {option === "off" ? "Off" : option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  Last appointment: {formatDateTime(mockLastAppointment)}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {nextBookAgainReminder
                    ? `Next reminder: ${formatDateTime(nextBookAgainReminder)}`
                    : "Book-again reminders are off"}
                </p>
              </div>

              <Button variant="outline" onClick={() => handleSendTest("book_again")}>
                Send Test Book-Again Reminder
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        <div className="text-sm text-muted-foreground">
          {lastSaved ? `Last saved: ${formatDateTime(lastSaved)}` : "Not saved yet"}
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}

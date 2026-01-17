"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { setBarberStatus, getBarberStatus, addBreakRequest, getBreakRequests, removeBreakRequest } from "@/lib/break-requests"

type BreakStatus = "available" | "on_break" | "break_requested" | "busy"

interface BreakStatusProps {
  currentStatus: BreakStatus
  onStatusChange: (status: BreakStatus) => void
  canSelfBreak?: boolean // If true, barber can set break themselves, otherwise needs approval
  barberId?: string // Barber's unique ID
  barberName?: string // Barber's name for display in POS
}

export function BreakStatusControl({ 
  currentStatus, 
  onStatusChange,
  canSelfBreak = false,
  barberId = "current_barber", // Default ID for demo
  barberName = "Barber" // Default name for demo
}: BreakStatusProps) {
  const [breakDuration, setBreakDuration] = useState(15) // minutes
  const [localStatus, setLocalStatus] = useState<BreakStatus>(currentStatus)

  // Listen for status changes from POS (via localStorage)
  useEffect(() => {
    const checkStatus = () => {
      const storedStatus = getBarberStatus(barberId)
      if (storedStatus !== localStatus) {
        setLocalStatus(storedStatus)
        onStatusChange(storedStatus)
      }
    }

    // Check on mount
    checkStatus()

    // Listen for storage events (cross-tab communication)
    window.addEventListener("storage", checkStatus)
    
    // Also poll periodically to catch same-tab updates
    const interval = setInterval(checkStatus, 1000)

    return () => {
      window.removeEventListener("storage", checkStatus)
      clearInterval(interval)
    }
  }, [barberId, localStatus, onStatusChange])

  // Sync local status with prop
  useEffect(() => {
    setLocalStatus(currentStatus)
  }, [currentStatus])

  const handleGoOnBreak = () => {
    if (canSelfBreak) {
      setBarberStatus(barberId, "on_break")
      setLocalStatus("on_break")
      onStatusChange("on_break")
    } else {
      // Create break request
      addBreakRequest({
        barberId,
        barberName,
        requestedAt: new Date(),
        duration: breakDuration
      })
      setBarberStatus(barberId, "break_requested")
      setLocalStatus("break_requested")
      onStatusChange("break_requested")
    }
  }

  const handleEndBreak = () => {
    setBarberStatus(barberId, "available")
    setLocalStatus("available")
    onStatusChange("available")
  }

  const handleCancelRequest = () => {
    // Find and remove the pending request
    const requests = getBreakRequests()
    const pendingRequest = requests.find(
      req => req.barberId === barberId && req.status === "pending"
    )
    if (pendingRequest) {
      removeBreakRequest(pendingRequest.id)
    }
    
    setBarberStatus(barberId, "available")
    setLocalStatus("available")
    onStatusChange("available")
  }

  const getStatusColor = (status: BreakStatus) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "on_break":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "break_requested":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "busy":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-secondary text-muted-foreground"
    }
  }

  const getStatusText = (status: BreakStatus) => {
    switch (status) {
      case "available":
        return "Available"
      case "on_break":
        return "On Break"
      case "break_requested":
        return "Break Requested"
      case "busy":
        return "Busy"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coffee className="h-5 w-5 mr-2" />
          Break Status
        </CardTitle>
        <CardDescription>Manage your availability and break time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status Display */}
        <div className={`p-4 rounded-lg border ${getStatusColor(localStatus)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1">Current Status</p>
              <p className="text-lg font-bold">{getStatusText(localStatus)}</p>
            </div>
            <div className="flex items-center">
              {localStatus === "available" && (
                <CheckCircle className="h-6 w-6 text-green-400" />
              )}
              {localStatus === "on_break" && (
                <Coffee className="h-6 w-6 text-yellow-400" />
              )}
              {localStatus === "break_requested" && (
                <AlertCircle className="h-6 w-6 text-orange-400" />
              )}
              {localStatus === "busy" && (
                <Clock className="h-6 w-6 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Break Duration Selector (only show when going on break) */}
        {(localStatus === "available" || localStatus === "break_requested") && (
          <div>
            <label className="text-sm font-medium mb-2 block">Break Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => setBreakDuration(minutes)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    breakDuration === minutes
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-accent"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {localStatus === "available" && (
            <Button
              onClick={handleGoOnBreak}
              variant="outline"
              className="w-full"
            >
              <Coffee className="h-4 w-4 mr-2" />
              {canSelfBreak ? "Go On Break" : "Request Break"}
            </Button>
          )}

          {localStatus === "on_break" && (
            <Button
              onClick={handleEndBreak}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              End Break
            </Button>
          )}

          {localStatus === "break_requested" && (
            <>
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm text-orange-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Waiting for manager approval...
                </p>
              </div>
              <Button
                onClick={handleCancelRequest}
                variant="outline"
                className="w-full"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Request
              </Button>
            </>
          )}

          {localStatus === "busy" && (
            <p className="text-sm text-muted-foreground text-center">
              Complete your current appointment to change status
            </p>
          )}
        </div>

        {/* Break Info */}
        {localStatus === "on_break" && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              Break started. You'll be back in {breakDuration} minutes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


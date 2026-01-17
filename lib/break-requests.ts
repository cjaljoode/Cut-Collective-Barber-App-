// Shared break request management
// In a real app, this would be handled by a backend API

export interface BreakRequest {
  id: string
  barberId: string
  barberName: string
  requestedAt: Date
  duration: number
  status: "pending" | "approved" | "denied"
}

const STORAGE_KEY = "break_requests"

export function getBreakRequests(): BreakRequest[] {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    const requests = JSON.parse(stored)
    return requests.map((req: any) => ({
      ...req,
      requestedAt: new Date(req.requestedAt)
    }))
  } catch {
    return []
  }
}

export function addBreakRequest(request: Omit<BreakRequest, "id" | "status">): BreakRequest {
  const requests = getBreakRequests()
  const newRequest: BreakRequest = {
    ...request,
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: "pending"
  }
  
  requests.push(newRequest)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  
  // Trigger storage event for cross-tab communication
  window.dispatchEvent(new Event("storage"))
  
  return newRequest
}

export function updateBreakRequestStatus(
  requestId: string,
  status: "approved" | "denied"
): BreakRequest | null {
  const requests = getBreakRequests()
  const request = requests.find(req => req.id === requestId)
  
  if (!request) return null
  
  request.status = status
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  
  // Store the barber's new status
  if (status === "approved") {
    localStorage.setItem(`barber_status_${request.barberId}`, "on_break")
  } else {
    localStorage.setItem(`barber_status_${request.barberId}`, "available")
  }
  
  // Trigger storage event
  window.dispatchEvent(new Event("storage"))
  
  return request
}

export function removeBreakRequest(requestId: string): void {
  const requests = getBreakRequests().filter(req => req.id !== requestId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  window.dispatchEvent(new Event("storage"))
}

export function getBarberStatus(barberId: string): "available" | "on_break" | "break_requested" | "busy" {
  if (typeof window === "undefined") return "available"
  
  // Check if there's a pending request
  const requests = getBreakRequests()
  const pendingRequest = requests.find(
    req => req.barberId === barberId && req.status === "pending"
  )
  
  if (pendingRequest) return "break_requested"
  
  // Check stored status
  const status = localStorage.getItem(`barber_status_${barberId}`)
  if (status === "on_break") return "on_break"
  if (status === "busy") return "busy"
  
  return "available"
}

export function setBarberStatus(
  barberId: string,
  status: "available" | "on_break" | "break_requested" | "busy"
): void {
  if (typeof window === "undefined") return
  
  localStorage.setItem(`barber_status_${barberId}`, status)
  window.dispatchEvent(new Event("storage"))
  
  // Note: Break requests should be created explicitly via addBreakRequest
  // This function only sets the status
}


"use client"

import { Clock, User, Scissors, DollarSign, CheckCircle, X, Coffee, AlertCircle, Check, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBreakRequests, updateBreakRequestStatus, removeBreakRequest, type BreakRequest as BreakRequestType } from "@/lib/break-requests"

interface POSAppProps {
  children?: React.ReactNode
}

interface Service {
  id: string
  name: string
  price: number
  duration: number
}

interface CartItem extends Service {
  quantity: number
}


const services: Service[] = [
  { id: "1", name: "Haircut", price: 25, duration: 30 },
  { id: "2", name: "Beard Trim", price: 15, duration: 15 },
  { id: "3", name: "Haircut + Beard", price: 35, duration: 45 },
  { id: "4", name: "Line Up", price: 12, duration: 20 },
  { id: "5", name: "Fade", price: 30, duration: 35 },
  { id: "6", name: "Hot Towel", price: 10, duration: 10 },
]

export function POSApp({ children }: POSAppProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [breakRequests, setBreakRequests] = useState<BreakRequestType[]>([])

  // Load break requests from storage
  useEffect(() => {
    const loadRequests = () => {
      const requests = getBreakRequests()
      setBreakRequests(requests)
    }

    loadRequests()

    // Listen for storage events (when barbers request breaks)
    const handleStorage = () => {
      loadRequests()
    }

    window.addEventListener("storage", handleStorage)
    
    // Also poll periodically
    const interval = setInterval(loadRequests, 1000)

    return () => {
      window.removeEventListener("storage", handleStorage)
      clearInterval(interval)
    }
  }, [])

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id)
      if (existing) {
        return prev.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...service, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalDuration = cart.reduce(
    (sum, item) => sum + item.duration * item.quantity,
    0
  )

  const handleCheckout = () => {
    // In a real app, this would process payment
    alert(`Processing payment of $${total.toFixed(2)}`)
    setCart([])
  }

  const handleApproveBreak = (requestId: string) => {
    const request = updateBreakRequestStatus(requestId, "approved")
    if (request) {
      // Update local state
      setBreakRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: "approved" as const } : req
        )
      )
      // Remove after showing confirmation
      setTimeout(() => {
        removeBreakRequest(requestId)
        setBreakRequests(prev => prev.filter(req => req.id !== requestId))
      }, 2000)
    }
  }

  const handleDenyBreak = (requestId: string) => {
    const request = updateBreakRequestStatus(requestId, "denied")
    if (request) {
      // Update local state
      setBreakRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: "denied" as const } : req
        )
      )
      // Remove after showing confirmation
      setTimeout(() => {
        removeBreakRequest(requestId)
        setBreakRequests(prev => prev.filter(req => req.id !== requestId))
      }, 2000)
    }
  }

  const pendingRequests = breakRequests.filter(req => req.status === "pending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* POS Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <Scissors className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">POS Terminal</h1>
                <p className="text-sm text-muted-foreground">Elite Cuts Barbershop</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Cashier</div>
                <div className="text-sm font-medium text-foreground">John Doe</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Break Requests Alert */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-orange-500/50 bg-orange-500/10">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-400">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Break Requests ({pendingRequests.length})
                </CardTitle>
                <CardDescription>Barbers requesting break time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-orange-500/30 bg-background"
                    >
                      <div>
                        <p className="font-medium text-foreground">{request.barberName}</p>
                        <p className="text-sm text-muted-foreground">
                          Requested {request.duration} min break • {Math.floor((Date.now() - request.requestedAt.getTime()) / 60000)} min ago
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveBreak(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDenyBreak(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-foreground mb-2">Select Services</h2>
              <p className="text-sm text-muted-foreground">Tap to add services to cart</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => addToCart(service)}
                  className="p-6 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      ${service.price}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.duration}m
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Scissors className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Cart is empty</p>
                      <p className="text-xs mt-1">Select services to get started</p>
                    </motion.div>
                  ) : (
                    cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price} × {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 rounded-md border border-border hover:bg-accent flex items-center justify-center"
                          >
                            <span className="text-sm">−</span>
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-md border border-border hover:bg-accent flex items-center justify-center"
                          >
                            <span className="text-sm">+</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 rounded-md border border-border hover:bg-destructive/10 hover:border-destructive flex items-center justify-center ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>

                {cart.length > 0 && (
                  <>
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{totalDuration} min</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Button
                        onClick={handleCheckout}
                        className="w-full h-12 text-lg font-semibold"
                        size="lg"
                      >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Process Payment
                      </Button>
                      <Button
                        onClick={() => setCart([])}
                        variant="outline"
                        className="w-full"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


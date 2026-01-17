import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Settings,
  UserPlus,
  Copy,
  ShieldCheck,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PeakHourChart } from "@/components/owner/peak-hour-chart"

export default async function OwnerDashboard() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const cookieStore = cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieStore,
  })

  // 1. Check Auth & Role
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, shops(*)")
    .eq("id", session.user.id)
    .single()

  if (profile?.role !== "owner") redirect("/dashboard")

  const shop = profile.shops
  if (!shop) redirect("/onboarding/shop")

  // 2. Fetch Dashboard Data
  const { data: barbers } = await supabase
    .from("profiles")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("role", "barber")

  const { data: recentAppointments } = await supabase
    .from("appointments")
    .select(
      "start_time, status, services(price), profiles!appointments_client_id_fkey(full_name)"
    )
    .eq("shop_id", shop.id)
    .order("start_time", { ascending: false })
    .limit(6)

  const { count: totalBookings } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shop.id)

  const totalRevenue = (recentAppointments || []).reduce((sum, appt) => {
    const price = (appt.services as { price?: number })?.price || 0
    return sum + price
  }, 0)

  const peakHourData = Array.from({ length: 10 }).map((_, idx) => {
    const hour = 9 + idx
    return { hour: `${hour}:00`, bookings: 0 }
  })

  ;(recentAppointments || []).forEach((appt) => {
    const hour = new Date(appt.start_time).getHours()
    const index = hour - 9
    if (index >= 0 && index < peakHourData.length) {
      peakHourData[index].bookings += 1
    }
  })

  const peakHour = peakHourData.reduce(
    (max, item) => (item.bookings > max.bookings ? item : max),
    peakHourData[0]
  )

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white uppercase">
              {shop.name} <span className="text-amber-500">HQ</span>
            </h1>
            <p className="text-zinc-500 text-sm">
              Manage your shop, team, and revenue from one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" /> Shop Settings
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              <UserPlus className="w-4 h-4 mr-2" /> Invite Barber
            </Button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Total Bookings
              </CardTitle>
              <Calendar className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalBookings || 0}
              </div>
              <p className="text-xs text-zinc-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Active Barbers
              </CardTitle>
              <Users className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {barbers?.length || 0}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Full team capacity</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Peak Hour
              </CardTitle>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {peakHour?.hour || "N/A"}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Highest booking volume
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Peak Hour Heatmap</CardTitle>
            <CardDescription className="text-zinc-500">
              Booking density by hour (9 AM – 6 PM)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PeakHourChart data={peakHourData} />
          </CardContent>
        </Card>

        {/* Barber Management */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-white">Barber Management</CardTitle>
                <CardDescription className="text-zinc-500">
                  Control access, set commissions, and manage staff.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-500">
                  {shop.invite_code || "N/A"}
                </div>
                <Button variant="outline" className="border-zinc-800 text-zinc-300">
                  <Copy className="w-4 h-4 mr-2" /> Copy Invite
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="border-zinc-800">
                <TableRow>
                  <TableHead className="text-zinc-400">Barber</TableHead>
                  <TableHead className="text-zinc-400">Experience</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Commission</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barbers?.map((barber) => (
                  <TableRow key={barber.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-medium text-white">
                      {barber.full_name || "Barber"}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {barber.experience_years ?? 0} Years
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-500 uppercase text-[10px]">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">70%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" className="border-zinc-800 text-zinc-300">
                        Revoke Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!barbers || barbers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-zinc-500 italic">
                      No barbers joined yet. Share your invite code to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Commission Settings */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Commission Settings</CardTitle>
            <CardDescription className="text-zinc-500">
              Set a global commission and override per barber if needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <label className="text-sm text-zinc-400 w-40">
                Global Commission
              </label>
              <input
                type="number"
                defaultValue={70}
                className="w-32 px-3 py-2 bg-zinc-950 border border-zinc-800 text-white"
              />
              <span className="text-xs text-zinc-500">Barber share (%)</span>
            </div>
            <div className="space-y-3">
              {barbers?.map((barber) => (
                <div key={barber.id} className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400 w-40">
                    {barber.full_name || "Barber"}
                  </span>
                  <input
                    type="number"
                    defaultValue={70}
                    className="w-32 px-3 py-2 bg-zinc-950 border border-zinc-800 text-white"
                  />
                  <span className="text-xs text-zinc-500">Override</span>
                </div>
              ))}
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              Save Commission Settings
            </Button>
          </CardContent>
        </Card>

        {/* Shop Settings */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Shop Settings</CardTitle>
            <CardDescription className="text-zinc-500">
              Update your shop profile and branding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400">Shop Name</label>
                <input
                  type="text"
                  defaultValue={shop.name}
                  className="mt-2 w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Address</label>
                <input
                  type="text"
                  defaultValue={shop.address || ""}
                  className="mt-2 w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-400">Shop Logo</label>
              <input
                type="file"
                className="mt-2 w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-white"
              />
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              Save Shop Settings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="bg-zinc-900/60 border-zinc-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Recent Bookings</CardTitle>
            <CardDescription className="text-zinc-500">
              Latest activity across your entire shop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentAppointments?.map((app) => (
                <div
                  key={app.start_time}
                  className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-amber-500">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {app.profiles?.full_name || "Client"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(app.start_time).toLocaleDateString()} at{" "}
                        {new Date(app.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-zinc-800 text-zinc-300 uppercase text-[10px]">
                    {app.status}
                  </Badge>
                </div>
              ))}
              {(!recentAppointments || recentAppointments.length === 0) && (
                <p className="text-zinc-500 italic">
                  No bookings found yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

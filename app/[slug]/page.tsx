import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Award,
  ShieldCheck,
  Scissors,
  Users,
} from "lucide-react"
import { PortfolioGallery } from "@/components/public/portfolio-gallery"
import { BookingModal } from "@/components/booking/booking-modal"

interface PageProps {
  params: { slug: string }
}

interface Service {
  id: string
  name: string
  price: number
  duration_minutes: number
}

// Dynamic Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const cookieStore = cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieStore,
  })

  const { data: shop } = await supabase
    .from("shops")
    .select("name")
    .eq("slug", params.slug)
    .single()
  const { data: barber } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", params.slug)
    .single()

  const title = shop?.name || barber?.full_name || "The Cut Collective"

  return {
    title: `${title} | Book Now`,
    description: `Professional grooming services at ${title}. Book your appointment online via The Cut Collective.`,
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const cookieStore = cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieStore,
  })
  const { slug } = params

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single()

  let barber = null
  if (!shop) {
    const { data: barberData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", slug)
      .eq("role", "barber")
      .single()
    barber = barberData
  }

  if (!shop && !barber) notFound()

  const isShop = !!shop
  const displayName = isShop ? shop.name : barber?.full_name
  const bio = isShop
    ? "Welcome to our shop. Browse our professional barbers below."
    : barber?.bio

  const servicesQuery = isShop
    ? supabase.from("services").select("*").eq("shop_id", shop.id)
    : supabase.from("services").select("*").eq("barber_id", barber?.id)

  const [{ data: services }, { data: barbers }] = await Promise.all([
    servicesQuery,
    isShop
      ? supabase
          .from("profiles")
          .select("id, full_name, avatar_url, experience_years, portfolio_url")
          .eq("shop_id", shop.id)
          .eq("role", "barber")
      : Promise.resolve({ data: [] }),
  ])

  const parsePortfolioUrls = (value?: string | null) => {
    if (!value) return []
    return value
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean)
  }

  const portfolioImages = isShop
    ? (barbers || [])
        .flatMap(
          (b) => parsePortfolioUrls((b as { portfolio_url?: string | null }).portfolio_url)
        )
        .slice(0, 18)
    : parsePortfolioUrls(barber?.portfolio_url)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Header Section */}
      <div className="relative h-80 bg-zinc-900 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-500 bg-zinc-800 overflow-hidden shadow-xl shadow-amber-500/10">
              <Image
                src={
                  isShop
                    ? "/shop-placeholder.jpg"
                    : barber?.avatar_url || "/avatar-placeholder.jpg"
                }
                alt={displayName || "Profile"}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {displayName}
                </h1>
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                <span className="flex items-center gap-1 font-medium text-white">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9
                  (128 reviews)
                </span>
                {isShop ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    {shop.address || "Premium Location"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    {barber?.experience_years ?? 0} Years Experience
                  </span>
                )}
                <Badge
                  variant="outline"
                  className="border-amber-500/50 text-amber-500 bg-amber-500/5 uppercase tracking-widest text-[10px]"
                >
                  {isShop ? "Full Shop" : "Independent"}
                </Badge>
              </div>
            </div>
            <div className="md:text-right">
              <BookingModal
                displayName={displayName}
                services={(services || []) as Service[]}
                barberId={barber?.id || null}
                shopId={shop?.id || null}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Info and Tabs */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Scissors className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold uppercase tracking-wider">
                  The Craft
                </h2>
              </div>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                {bio ||
                  "Professional grooming services tailored to your style. Experience the difference of a precision cut."}
              </p>
            </section>

            <Tabs defaultValue="services" className="w-full">
              <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-none w-full justify-start overflow-x-auto">
                <TabsTrigger
                  value="services"
                  className="rounded-none data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold uppercase px-6"
                >
                  Services
                </TabsTrigger>
                {isShop && (
                  <TabsTrigger
                    value="barbers"
                    className="rounded-none data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold uppercase px-6"
                  >
                    Our Team
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="portfolio"
                  className="rounded-none data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold uppercase px-6"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none data-[state=active]:bg-amber-500 data-[state=active]:text-black font-bold uppercase px-6"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="pt-8 space-y-4">
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <Card
                      key={service.id}
                      className="bg-zinc-900/40 border-zinc-800 text-white rounded-none group hover:border-amber-500/50 transition-colors"
                    >
                      <CardContent className="p-6 flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-bold text-xl group-hover:text-amber-500 transition-colors">
                            {service.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" />
                              {service.duration_minutes}m
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span>Precision Grooming</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-2xl font-black text-white">
                            ${service.price}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-zinc-500 italic">No services listed yet.</p>
                )}
              </TabsContent>

              <TabsContent value="barbers" className="pt-8">
                {isShop && barbers && barbers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {barbers.map((member) => (
                      <Card
                        key={member.id}
                        className="bg-zinc-900/40 border-zinc-800 text-white rounded-none"
                      >
                        <CardContent className="p-5 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={member.avatar_url || "/avatar-placeholder.jpg"}
                              alt={member.full_name || "Barber"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">
                              {member.full_name || "Barber"}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {member.experience_years ?? 0} years experience
                            </p>
                          </div>
                          <Users className="w-4 h-4 text-amber-500" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500">No barbers listed yet.</p>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="pt-8">
                <PortfolioGallery images={portfolioImages} />
              </TabsContent>

              <TabsContent value="reviews" className="pt-8 space-y-4">
                {[
                  { name: "Michael T.", rating: 5, text: "Best fade in the city. Clean work." },
                  { name: "Andre K.", rating: 5, text: "Super professional and on time." },
                  { name: "Jordan P.", rating: 4, text: "Great cut, solid experience." },
                ].map((review, idx) => (
                  <Card
                    key={idx}
                    className="bg-zinc-900/40 border-zinc-800 text-white rounded-none"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-amber-500 mb-2">
                        {"★".repeat(review.rating)}
                      </div>
                      <p className="text-sm text-zinc-400">"{review.text}"</p>
                      <p className="text-xs text-zinc-500 mt-2">— {review.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side: Sticky Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 text-white sticky top-24 rounded-none border-t-4 border-t-amber-500">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-500" />
                  Hours of Operation
                </h3>
                <div className="space-y-4">
                  {[
                    { days: "Mon - Fri", time: "9:00 AM - 8:00 PM" },
                    { days: "Saturday", time: "10:00 AM - 6:00 PM" },
                    { days: "Sunday", time: "Closed" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-zinc-400 font-medium">{item.days}</span>
                      <span className="text-white font-bold">{item.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <p className="text-xs text-zinc-500 text-center uppercase tracking-widest">
                    Cancellations required 24h in advance
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

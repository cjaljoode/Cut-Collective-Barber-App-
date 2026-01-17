"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Scissors, Sparkles } from "lucide-react"

export default function ShopOnboardingPage() {
  const [shopName, setShopName] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createShopWithInviteCode = async (ownerId: string) => {
    let attempts = 0
    while (attempts < 5) {
      const inviteCode = generateInviteCode()
      const { data, error: insertError } = await supabase
        .from("shops")
        .insert([
          {
            name: shopName.trim(),
            address: address.trim(),
            invite_code: inviteCode,
            owner_id: ownerId,
          },
        ])
        .select()
        .single()

      if (!insertError && data) {
        return data
      }

      // Retry on unique invite_code conflict
      if (insertError?.message?.toLowerCase().includes("invite_code")) {
        attempts += 1
        continue
      }

      throw insertError
    }
    throw new Error("Failed to generate a unique invite code. Please try again.")
  }

  const handleCreateShop = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Please log in first.")
      setLoading(false)
      return
    }

    try {
      const shop = await createShopWithInviteCode(user.id)

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ shop_id: shop.id })
        .eq("id", user.id)

      if (updateError) {
        throw updateError
      }

      router.push("/dashboard/owner")
    } catch (err: any) {
      setError(err?.message || "Error creating shop. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl bg-zinc-900/60 border-zinc-800 rounded-none">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3 text-amber-500">
            <Scissors className="w-6 h-6" />
            <span className="uppercase text-xs tracking-[0.3em]">The Cut Collective</span>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Set Up Your Shop
          </CardTitle>
          <p className="text-sm text-zinc-400">
            Create your shop profile and generate a unique invite code for barbers.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateShop} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Shop Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-black border border-zinc-800 text-white rounded-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="The Cut Collective HQ"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 text-white rounded-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Barber St, NY"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-none"
            >
              {loading ? "Creating..." : "Create Shop & Generate Invite Code"}
            </Button>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Invite codes are auto-generated and unique.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

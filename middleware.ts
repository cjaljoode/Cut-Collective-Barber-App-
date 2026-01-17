import { NextRequest, NextResponse } from "next/server"
import { parseTenantFromHost } from "@/lib/tenant"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const tenant = parseTenantFromHost(host)

  const headers = new Headers(request.headers)
  if (tenant) {
    headers.set("x-tenant", tenant)
  }

  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  return response
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico).*)"],
}

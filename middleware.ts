import { NextRequest, NextResponse } from "next/server"
import { parseTenantFromHost } from "@/lib/tenant"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const tenant = parseTenantFromHost(host)

  if (!tenant) {
    return NextResponse.next()
  }

  const headers = new Headers(request.headers)
  headers.set("x-tenant", tenant)

  return NextResponse.next({
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico).*)"],
}

export const PRIMARY_DOMAIN =
  process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || "thecutcollective.com"

export function parseTenantFromHost(hostname: string): string | null {
  if (!hostname) return null

  const host = hostname.toLowerCase().split(":")[0]

  // Localhost support: {tenant}.localhost
  if (host === "localhost") return null
  if (host.endsWith(".localhost")) {
    const subdomain = host.replace(".localhost", "")
    return subdomain.length > 0 ? subdomain : null
  }

  // Primary domain support: {tenant}.primary-domain.com
  if (host === PRIMARY_DOMAIN) return null
  if (host.endsWith(`.${PRIMARY_DOMAIN}`)) {
    const subdomain = host.replace(`.${PRIMARY_DOMAIN}`, "")
    if (!subdomain || subdomain === "www") return null
    return subdomain
  }

  return null
}

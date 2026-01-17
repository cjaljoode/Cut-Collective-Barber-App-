import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to customer app by default
  redirect("/customer")
}

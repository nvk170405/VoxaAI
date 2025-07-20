import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-toggler"
import Footer from "@/components/Footer"



export const metadata: Metadata = {
  title: "Login",
  description: "Pricing page for a SaaS product using Shadcn UI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>

          <nav className="pt-2 px-4 flex justify-end">
            
          </nav>
          {children}
        
        <Footer/>
      </body>
    </html>
  )
}

import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-toggler"

const layout = async ({children}: {children: React.ReactNode}) => {


  return (
    <AuthProvider>
      
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  
                  
                  {children}
        </ThemeProvider>
       
        
   </AuthProvider>

  )
}

export default layout;

'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from "@/components/theme-provider";
import { PublicRoute } from '@/components/auth/PublicRoute';
import Footer from "@/components/Footer";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PublicRoute>
          <nav className="pt-2 px-4 flex justify-end" />
          {children}
          <Footer />
        </PublicRoute>
      </ThemeProvider>
    </AuthProvider>
  );
}
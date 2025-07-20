"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      themes={["emerald", "orange", "dark", "light"]} // Add your custom themes here
      enableSystem={true} // Enables system-based theme switching
      attribute="class" // Uses the `class` attribute to apply the theme
    >
      {children}
    </NextThemesProvider>
  );
}

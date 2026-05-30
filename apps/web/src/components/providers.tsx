"use client";

import { Toaster } from "@darasa-lako/ui/components/sonner";

import { ThemeProvider } from "./theme-provider";
import { ResourcesProvider } from "@/app/store/resource-state";
import { ResourceDialog } from "@/app/dashboard/resources/components/resource-dialog";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ResourcesProvider>
        {children}
        <ResourceDialog hideTrigger />
        <Toaster richColors />
      </ResourcesProvider>
    </ThemeProvider>
  );
}

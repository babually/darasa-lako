"use client";

import { Toaster } from "@darasa-lako/ui/components/sonner";
import { ResourceDialog } from "@/app/dashboard/resources/components/resource-dialog";
import { ResourcesProvider } from "@/app/store/resource-state";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			disableTransitionOnChange
		>
			<ResourcesProvider>
				{children}
				<ResourceDialog hideTrigger />
				<Toaster richColors />
			</ResourcesProvider>
		</ThemeProvider>
	);
}

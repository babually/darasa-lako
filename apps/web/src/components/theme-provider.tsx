"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

// Suppress the React 19 script tag warning for next-themes
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
	const orig = console.error;
	console.error = (...args: unknown[]) => {
		if (
			typeof args[0] === "string" &&
			args[0].includes("Encountered a script tag")
		) {
			return;
		}
		orig.apply(console, args);
	};
}

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <>{children}</>;
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

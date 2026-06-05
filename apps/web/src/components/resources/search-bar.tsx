"use client";

import { Input } from "@darasa-lako/ui/components/input";
import { Search } from "lucide-react";

export function SearchBar() {
	return (
		<div className="relative mx-auto w-106">
			<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				placeholder="Search all resources..."
				className="w-full rounded-xl border-border bg-input py-6 pr-4 pl-12 text-base shadow-sm focus-visible:ring-primary"
			/>
		</div>
	);
}

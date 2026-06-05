"use client";

import { Button } from "@darasa-lako/ui/components/button";
import { Plus } from "lucide-react";
import { useResources } from "@/app/store/resource-state";

export function SubmitButton() {
	const { setActiveResourceEditId } = useResources();

	return (
		<Button
			onClick={() => setActiveResourceEditId("new")}
			className="fixed right-6 bottom-6 rounded-full bg-primary px-5 py-6 text-primary-foreground shadow-lg hover:bg-primary/90"
		>
			<Plus className="mr-2 h-5 w-5" />
			Submit Material
		</Button>
	);
}

"use client";

import { Button } from "@darasa-lako/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@darasa-lako/ui/components/empty";
import { Input } from "@darasa-lako/ui/components/input";
import { FolderIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useResources } from "@/app/store/resource-state";
import { ResourceCard } from "./components/resource-card";

export default function ResourcesPage() {
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	// const [subjectFilter, setSubjectFilter] = useState("all");

	const resourcesState = useResources();
	const { resources } = resourcesState;

	// const subjects = useMemo(() => {
	//   if (!resources) return ["all"];
	//   return ["all", ...Array.from(new Set(resources.map((r) => r.subject)))];
	// }, [resources]);

	const types = ["all", "notes", "exam", "resource"];

	const filtered = useMemo(() => {
		if (!resources) return [];
		return resources.filter((n) => {
			const matchesSearch =
				n.title.toLowerCase().includes(search.toLowerCase()) ||
				n.description.toLowerCase().includes(search.toLowerCase());
			// const matchesSubject = subjectFilter === "all" || n.subject === subjectFilter;
			const matchesType = typeFilter === "all" || n.type === typeFilter;
			return matchesSearch && matchesType;
		});
	}, [resources, search, typeFilter]);

	if (!resources) {
		return (
			<div className="flex items-center justify-center p-6 lg:p-8">
				<p className="text-slate-500">Loading resources...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6 lg:p-8">
			{/* header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
						<FolderIcon className="h-5 w-5 text-blue-400" />
					</div>
					<div>
						<h1 className="font-bold text-2xl">My Resources</h1>
						<p className="text-slate-500 text-sm">
							All materials assigned to you
						</p>
					</div>
				</div>
				<Button
					onClick={() => resourcesState.setActiveResourceEditId("new")}
					className="gap-2 border-0 bg-blue-600 text-white shadow-blue-500/20 shadow-lg hover:bg-blue-500"
				>
					<PlusIcon className="h-4 w-4" />
					Add Resource
				</Button>
			</div>

			{/* filters */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-3">
					<div className="relative w-full md:w-80">
						<SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by title or description..."
							className="pl-9 placeholder:text-slate-600 focus:border-blue-500/50"
						/>
					</div>
				</div>

				<div className="space-y-3">
					<div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
						{/* <span className="text-xs font-medium text-slate-500 uppercase tracking-wider shrink-0 mr-2">Types:</span> */}
						{types.map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => setTypeFilter(t)}
								className={`whitespace-nowrap rounded-full border px-3 py-1 font-medium text-xs transition-all ${
									typeFilter === t
										? "border-blue-600 bg-blue-600 text-white"
										: "border-white/10 bg-[#0f1623] text-slate-400 hover:border-white/20 hover:text-white"
								}`}
							>
								{t === "all"
									? "All Types"
									: t.charAt(0).toUpperCase() + t.slice(1)}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* resource list */}
			{filtered.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
					{filtered.map((resource) => (
						<ResourceCard key={resource.id} resource={resource} />
					))}
				</div>
			) : (
				<Empty className="">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<FolderIcon />
						</EmptyMedia>
						<EmptyTitle>No resources yet</EmptyTitle>
						<EmptyDescription>Upload your first resource now.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							onClick={() => resourcesState.setActiveResourceEditId("new")}
							variant="outline"
							size="sm"
						>
							Upload Resource
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}

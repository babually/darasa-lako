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
import { FolderIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ResourceCard } from "@/app/dashboard/resources/components/resource-card";
import { useResources } from "@/app/store/resource-state";

export default function ResourceSection() {
	const [search, setSearch] = useState("");
	const [subjectFilter, _setSubjectFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

	const resourcesState = useResources();
	const { resources } = resourcesState;

	const _subjects = useMemo(() => {
		if (!resources) return ["all"];
		return ["all", ...Array.from(new Set(resources.map((r) => r.subject)))];
	}, [resources]);

	const types = ["all", "notes", "exam", "resource"];

	const filtered = useMemo(() => {
		if (!resources) return [];
		return resources.filter((n) => {
			const matchesSearch =
				n.title.toLowerCase().includes(search.toLowerCase()) ||
				n.description.toLowerCase().includes(search.toLowerCase());
			const matchesSubject =
				subjectFilter === "all" || n.subject === subjectFilter;
			const matchesType = typeFilter === "all" || n.type === typeFilter;
			return matchesSearch && matchesSubject && matchesType;
		});
	}, [resources, search, subjectFilter, typeFilter]);

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
			{/* <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
          <FolderIcon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">All Resources</h1>
          <p className="text-slate-500 text-sm">{resources.length} resources available</p>
        </div>
      </div> */}

			{/* filters */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-3">
					<div className="relative mx-auto w-106 max-w-6xl">
						<SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by title or description..."
							className="w-full rounded-xl border-border bg-input py-6 pr-4 pl-12 text-base shadow-sm focus-visible:ring-primary"
							//   className="pl-9 bg-[#0f1623] border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50"
						/>
					</div>
				</div>

				<div className="space-y-6">
					<div className="no-scrollbar flex items-center justify-center gap-2 overflow-x-auto pb-1">
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

					{/* <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider shrink-0 mr-2">Subjects:</span>
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                  subjectFilter === s
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-[#0f1623] text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {s === "all" ? "All Subjects" : s}
              </button>
            ))}
          </div> */}
				</div>
			</div>

			{/* header */}
			<div className="flex items-center gap-3">
				{/* <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
          <FolderIcon className="w-5 h-5 text-blue-400" />
        </div> */}
				<div>
					<h1 className="font-bold text-2xl text-white">
						All Resources ({filtered.length})
					</h1>
					{/* <p className="text-slate-500 text-sm">{resources.length} </p> */}
				</div>
			</div>

			{/* resources grid */}
			{filtered.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
				// <div className="flex flex-col items-center justify-center py-20 text-center">
				//   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
				//     <FolderIcon className="w-7 h-7 text-slate-600" />
				//   </div>
				//   <p className="text-slate-400 font-medium">No resources found</p>
				//   <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query</p>
				// </div>
			)}
		</div>
	);
}

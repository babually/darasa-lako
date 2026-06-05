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
import { ClipboardListIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useResources } from "@/app/store/resource-state";
import { ResourceCard } from "../resources/components/resource-card";

export default function ExamsPage() {
	const [search, setSearch] = useState("");

	const resourcesState = useResources();
	const { resources } = resourcesState;
	const exams = resources?.filter((r) => r.type === "exam") || [];
	const filtered = exams.filter((r) =>
		r.title.toLowerCase().includes(search.toLowerCase()),
	);

	if (!resources) {
		return (
			<div className="flex items-center justify-center p-6 lg:p-8">
				<p className="text-slate-500">Loading exams...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6 lg:p-8">
			{/* header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
						<ClipboardListIcon className="h-5 w-5 text-amber-400" />
					</div>
					<div>
						<h1 className="font-bold text-2xl">Exams</h1>
						<p className="text-slate-500 text-sm">Manage your exams here.</p>
					</div>
				</div>
				<Button
					onClick={() => resourcesState.setActiveResourceEditId("new")}
					className="gap-2 border-0 bg-amber-600 text-white shadow-amber-500/20 shadow-lg hover:bg-amber-500"
				>
					<PlusIcon className="h-4 w-4" />
					Add Exam
				</Button>
			</div>

			{/* search */}
			<div className="relative w-72">
				<SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search exams..."
					className="border-slate-200 pl-9 text-slate-800 placeholder:text-slate-600 focus:border-amber-500/50"
				/>
			</div>

			{/* all exams */}
			<div>
				<h2 className="mb-4 font-semibold text-slate-400 text-sm uppercase tracking-wider">
					All Exams ({filtered.length})
				</h2>
				{filtered.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{filtered.map((exam) => (
							<ResourceCard key={exam.id} resource={exam} />
						))}
					</div>
				) : (
					<Empty className="">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ClipboardListIcon />
							</EmptyMedia>
							<EmptyTitle>No exams yet</EmptyTitle>
							<EmptyDescription>
								Upload your first exam resource now.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								onClick={() => resourcesState.setActiveResourceEditId("new")}
								variant="outline"
								size="sm"
							>
								Upload Exam
							</Button>
						</EmptyContent>
					</Empty>
					// <div className="flex flex-col items-center justify-center py-16 text-center">
					//   <div className="w-16 h-16 bg-amber-500/5 rounded-full flex items-center justify-center mb-4">
					//     <ClipboardListIcon className="w-7 h-7 text-amber-600" />
					//   </div>
					//   <p className="text-slate-400 font-medium">No exams found</p>
					// </div>
				)}
			</div>
		</div>
	);
}

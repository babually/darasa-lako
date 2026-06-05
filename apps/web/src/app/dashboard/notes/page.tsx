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
import {
	BookOpenIcon,
	DownloadIcon,
	EyeIcon,
	FileTextIcon,
	SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { useResources } from "@/app/store/resource-state";

export default function NotesPage() {
	const [search, setSearch] = useState("");
	const [subjectFilter, setSubjectFilter] = useState("all");

	const resourcesState = useResources();
	const { resources } = resourcesState;

	const notes = resources?.filter((r) => r.type === "notes") || [];

	const subjects = ["all", ...Array.from(new Set(notes.map((n) => n.subject)))];

	const filtered = notes.filter((n) => {
		const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase());
		const matchesSubject =
			subjectFilter === "all" || n.subject === subjectFilter;
		return matchesSearch && matchesSubject;
	});

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
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50">
					<BookOpenIcon className="h-5 w-5 text-violet-600" />
				</div>
				<div>
					<h1 className="font-bold text-2xl">My Notes</h1>
					<p className="text-slate-500 text-sm">
						{notes.length} notes assigned to you
					</p>
				</div>
			</div>

			{/* search + subject filter */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative w-64">
					<SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search notes..."
						className="border-slate-200 bg-white pl-9 text-slate-800 placeholder:text-slate-400 focus:border-blue-400"
					/>
				</div>
				<div className="flex flex-wrap gap-2">
					{subjects.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setSubjectFilter(s)}
							className={`rounded-lg border px-3 py-1.5 font-medium text-xs transition-all ${
								subjectFilter === s
									? "border-violet-600 bg-violet-600 text-white"
									: "border-slate-200 bg-white text-slate-500 hover:border-violet-300 hover:text-violet-600"
							}`}
						>
							{s === "all" ? "All Subjects" : s}
						</button>
					))}
				</div>
			</div>

			{/* notes list */}
			{filtered.length > 0 ? (
				<div className="space-y-3">
					{filtered.map((note) => (
						<div
							key={note.id}
							className="group rounded-xl border border-slate-100 p-5 transition-all hover:border-violet-200 hover:shadow-md"
						>
							<div className="flex items-start gap-4">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 transition-colors group-hover:bg-violet-100">
									<FileTextIcon className="h-6 w-6 text-violet-600" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-4">
										<div>
											<h3 className="font-semibold text-slate-800 transition-colors group-hover:text-violet-700">
												{note.title}
											</h3>
											<p className="mt-0.5 line-clamp-2 text-slate-500 text-sm">
												{note.description}
											</p>
										</div>
										<div className="shrink-0 text-right">
											<span className="text-slate-400 text-xs">
												{new Date(note.createdAt).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
												})}
											</span>
										</div>
									</div>
									<div className="mt-3 flex items-center gap-4">
										<span className="inline-flex items-center gap-1 rounded-lg border bg-white/5 px-2 py-1 text-slate-500 text-xs">
											<BookOpenIcon className="h-3 w-3" />
											{note.subject}
										</span>
										<span className="text-slate-400 text-xs">
											{note.fileSize
												? `${(note.fileSize / 1024 / 1024).toFixed(2)} MB`
												: "0 MB"}
										</span>
										<span className="text-slate-400 text-xs">
											by {note.uploader.name}
										</span>
										<div className="ml-auto flex flex-wrap gap-1">
											{note.tags.map((tag) => (
												<span
													key={tag}
													className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
							{/* actions */}
							<div className="mt-4 flex gap-2 pt-3">
								<Button
									size="sm"
									variant="ghost"
									className="gap-1.5 text-slate-500 text-xs hover:bg-violet-50 hover:text-violet-600"
								>
									<EyeIcon className="h-3.5 w-3.5" /> Preview
								</Button>
								<Button
									size="sm"
									variant="ghost"
									className="gap-1.5 text-slate-500 text-xs hover:bg-blue-50 hover:text-blue-600"
								>
									<DownloadIcon className="h-3.5 w-3.5" /> Download PDF
								</Button>
							</div>
						</div>
					))}
				</div>
			) : (
				<Empty className="">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<BookOpenIcon />
						</EmptyMedia>
						<EmptyTitle>No notes yet</EmptyTitle>
						<EmptyDescription>
							Upload your first note resource now.
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
			)}
		</div>
	);
}

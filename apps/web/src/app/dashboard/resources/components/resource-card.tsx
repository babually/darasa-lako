"use client";

import type { Prisma } from "@darasa-lako/db/client";
import { Button } from "@darasa-lako/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@darasa-lako/ui/components/card";
import {
	BookOpenIcon,
	ClipboardListIcon,
	DownloadIcon,
	EyeIcon,
	FileIcon,
	FolderIcon,
	TagIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { toast } from "sonner";
import { useResources } from "@/app/store/resource-state";

interface ResourceTypeConfig {
	icon: ComponentType<{ className?: string }>;
	color: string;
	badge: string;
	label: string;
	accent: string;
	dot: string;
}

const typeConfig: Record<string, ResourceTypeConfig> = {
	notes: {
		icon: BookOpenIcon,
		color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
		badge: "bg-violet-500/15 text-violet-300 border-violet-400/30",
		label: "Note",
		accent: "from-violet-500/20 to-transparent",
		dot: "bg-violet-400",
	},
	exam: {
		icon: ClipboardListIcon,
		color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
		badge: "bg-amber-500/15 text-amber-300 border-amber-400/30",
		label: "Exam",
		accent: "from-amber-500/20 to-transparent",
		dot: "bg-amber-400",
	},
	resource: {
		icon: FolderIcon,
		color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
		badge: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
		label: "Resource",
		accent: "from-cyan-500/20 to-transparent",
		dot: "bg-cyan-400",
	},
};

const defaultConfig = {
	icon: FolderIcon,
	color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
	badge: "bg-slate-500/15 text-slate-300 border-slate-400/30",
	label: "Unknown",
	accent: "from-slate-500/20 to-transparent",
	dot: "bg-slate-400",
};

export function ResourceCard({
	resource,
}: {
	resource: Prisma.ResourceGetPayload<{ include: { uploader: true } }>;
}) {
	const resourcesState = useResources();
	const config = typeConfig[resource.type] || defaultConfig;
	const Icon = config.icon;

	const handleView = async () => {
		if (!resource.fileUrl) {
			toast.error("No file URL available");
			return;
		}

		try {
			const response = await fetch("/api/byteship/url", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileUrl: resource.fileUrl,
					action: "view",
				}),
			});
			const data = await response.json();
			if (data.url) {
				window.open(data.url, "_blank");
			} else {
				throw new Error("Failed to get view URL");
			}

			// Update view count locally
			await resourcesState.updateResource(resource.id, {
				viewCount: (resource.viewCount || 0) + 1,
			});
		} catch (error) {
			console.error("Failed to view file:", error);
			// Fallback
			window.open(resource.fileUrl, "_blank");
		}
	};

	const handleDownload = async () => {
		if (!resource.fileUrl) {
			toast.error("No file URL available");
			return;
		}

		try {
			const response = await fetch("/api/byteship/url", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileUrl: resource.fileUrl,
					action: "download",
					fileName: resource.title.endsWith(".pdf")
						? resource.title
						: `${resource.title}.pdf`,
				}),
			});
			const data = await response.json();

			if (data.url) {
				// Create a temporary link and trigger download
				const link = document.createElement("a");
				link.href = data.url;
				link.target = "_blank";
				link.download = resource.title;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else {
				throw new Error("Failed to get download URL");
			}

			// Update download count locally
			await resourcesState.updateResource(resource.id, {
				downloadCount: (resource.downloadCount || 0) + 1,
			});
			toast.success("Download started");
		} catch (error) {
			console.error("Download failed:", error);
			toast.error("Failed to download file");
		}
	};

	return (
		<Card className="group mb-2 overflow-hidden border-border bg-card transition-all hover:border-primary/20">
			<div
				className={`absolute top-0 right-0 h-32 w-32 bg-linear-to-br ${config.accent} -mt-16 -mr-16 opacity-50 blur-3xl transition-opacity group-hover:opacity-100`}
			/>

			<CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-start gap-4">
					{/* icon */}
					<div
						className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors ${config.color}`}
					>
						<Icon className="h-5 w-5" />
					</div>

					<div className="min-w-0 flex-1">
						<div className="mb-1 flex items-center gap-2">
							<span
								className={`rounded-full border px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${config.badge}`}
							>
								{config.label}
							</span>
							<span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
								{resource.subject}
							</span>
						</div>
						<CardTitle className="truncate font-bold text-base text-foreground transition-colors group-hover:text-primary">
							{resource.title}
						</CardTitle>
					</div>
				</div>

				<div className="ml-4 flex shrink-0 flex-col items-end gap-1">
					<span className="font-medium text-[10px] text-muted-foreground">
						{new Date(resource.createdAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</span>
					<div className="flex items-center gap-1.5">
						<div
							className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`}
						/>
						<span className="font-bold text-[10px] text-muted-foreground uppercase tracking-tight">
							Active
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="relative py-3">
				<p className="mb-4 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
					{resource.description || "No description provided for this resource."}
				</p>

				<div className="flex items-center gap-4 font-medium text-[11px] text-muted-foreground/80">
					<div className="flex items-center gap-1.5">
						<FileIcon className="h-3.5 w-3.5" />
						<span>{resource.fileSize}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<EyeIcon className="h-3.5 w-3.5" />
						<span>{resource.viewCount || 0} views</span>
					</div>
					<div className="flex items-center gap-1.5">
						<TagIcon className="h-3.5 w-3.5" />
						<div className="flex gap-1">
							{resource.tags.slice(0, 2).map((tag) => (
								<span
									key={tag}
									className="rounded bg-muted px-1.5 py-0.5 text-[9px]"
								>
									{tag}
								</span>
							))}
							{resource.tags.length > 2 && (
								<span>+{resource.tags.length - 2}</span>
							)}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="relative flex flex-col gap-3 pt-2 pb-4">
				<div className="h-px w-full bg-border/50" />

				{/* actions */}
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="ghost"
						onClick={handleView}
						className="h-8 flex-1 gap-1.5 text-muted-foreground text-xs hover:bg-accent hover:text-foreground"
					>
						<EyeIcon className="h-3.5 w-3.5" />
						View
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={handleDownload}
						className="h-8 flex-1 gap-1.5 text-muted-foreground text-xs hover:bg-accent hover:text-foreground"
					>
						<DownloadIcon className="h-3.5 w-3.5" />
						Download
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}

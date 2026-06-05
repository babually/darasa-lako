"use client";

import {
	BookOpenIcon,
	ClipboardListIcon,
	FolderIcon,
	TrendingUpIcon,
	UsersIcon,
} from "lucide-react";
import Link from "next/link";
// import { user } from "@darasa-lako/auth/permissions";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useResources } from "@/app/store/resource-state";
import StatsCard from "@/components/resources/stats-card";
import { authClient } from "@/lib/auth-client";
import { ResourceCard } from "../resources/components/resource-card";
import { ResourceDialog } from "../resources/components/resource-dialog";
import { getDashboardStats } from "./actions";

export default function Page() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	const [stats, setStats] = useState({
		totalMembers: 0,
		totalNotes: 0,
		totalExams: 0,
		totalResourcesFiles: 0,
	});

	const { resources } = useResources();

	const recentResources = useMemo(() => {
		if (!resources) return [];
		return resources.slice(0, 3);
	}, [resources]);

	const totalResourceViews = useMemo(() => {
		if (!resources) return 0;
		return resources.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
	}, [resources]);

	useEffect(() => {
		const fetchStats = async () => {
			const data = await getDashboardStats();
			setStats(data);
		};
		fetchStats();
	}, []);

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login");
		}
	}, [isPending, session, router]);

	if (isPending || !resources) {
		return (
			<div className="flex items-center justify-center p-6 lg:p-8">
				<p className="text-slate-500">Loading resources...</p>
			</div>
		);
	}

	if (!session) return null;

	return (
		<div className="space-y-8 p-6 lg:p-8">
			{/* header */}
			<div className="flex items-center justify-between">
				<div>
					<p className="mt-0.5 flex flex-col">
						<span className="font-semibold text-2xl">
							Welcome back - {session.user?.name || ""}
						</span>
						<span className="text-slate-500">Here's an overview</span>
					</p>
				</div>
				<ResourceDialog />
			</div>

			{/* stats grid */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<StatsCard
					label="Total Members"
					value={stats.totalMembers}
					icon={UsersIcon}
					trend={12}
					color="violet"
				/>
				<StatsCard
					label="Total Notes"
					value={stats.totalNotes}
					icon={BookOpenIcon}
					trend={8}
					color="cyan"
				/>
				<StatsCard
					label="Active Exams"
					value={stats.totalExams}
					icon={ClipboardListIcon}
					trend={0}
					color="amber"
				/>
				<StatsCard
					label="Resources"
					value={stats.totalResourcesFiles}
					icon={FolderIcon}
					trend={5}
					color="emerald"
				/>
			</div>

			{/* engagement row */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="rounded-xl border border-border bg-card p-5 shadow-sm">
					<div className="mb-4 flex items-center gap-2">
						<TrendingUpIcon className="h-4 w-4 text-emerald-500" />
						<h3 className="font-semibold text-foreground text-sm">
							Engagement
						</h3>
					</div>
					<div className="space-y-4">
						<div>
							<div className="mb-1.5 flex justify-between text-xs">
								<span className="text-muted-foreground">Total Views</span>
								<span className="font-medium text-foreground">
									{totalResourceViews}
								</span>
							</div>
							<div className="h-1.5 overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400"
									style={{
										width: `${Math.min(100, (totalResourceViews / 100) * 100)}%`,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* recent resources */}
			<div>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-semibold text-base text-white">
						Recent Resources
					</h2>
					<Link
						href="/dashboard/resources"
						className="text-violet-400 text-xs transition-colors hover:text-violet-300"
					>
						View all →
					</Link>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{recentResources.map((r) => (
						<ResourceCard key={r.id} resource={r} />
					))}
				</div>
			</div>
		</div>
	);
}

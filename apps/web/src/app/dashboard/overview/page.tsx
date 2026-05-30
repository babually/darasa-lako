"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpenIcon, ClipboardListIcon, FolderIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { useResources } from "@/app/store/resource-state";
import StatsCard from "@/components/resources/stats-card";
import { ResourceDialog } from "../resources/components/resource-dialog";
import { ResourceCard } from "../resources/components/resource-card";
import { getDashboardStats } from "./actions";
// import { user } from "@darasa-lako/auth/permissions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
      <div className="p-6 lg:p-8 flex items-center justify-center">
        <p className="text-slate-500">Loading resources...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="mt-0.5 flex flex-col">
            <span className="text-2xl font-semibold">Welcome back - {session.user?.name || ''}</span>
            <span className="text-slate-500">Here's an overview</span>
          </p>
        </div>
        <ResourceDialog />
      </div>

      {/* stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-foreground">Engagement</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Total Views</span>
                <span className="text-foreground font-medium">{totalResourceViews}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full" 
                  style={{ width: `${Math.min(100, (totalResourceViews / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* recent resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Resources</h2>
          <Link
            href="/dashboard/resources"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentResources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
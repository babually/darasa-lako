"use client";

import { Button } from "@darasa-lako/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
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
import type { Prisma } from "@darasa-lako/db/client";
import { useResources } from "@/app/store/resource-state";
import { toast } from "sonner";

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

export function ResourceCard({ resource }: { resource: Prisma.ResourceGetPayload<{ include: { uploader: true } }> }) {
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
          fileName: resource.title.endsWith(".pdf") ? resource.title : `${resource.title}.pdf`,
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
    <Card className="mb-2 bg-card border-border hover:border-primary/20 transition-all group overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${config.accent} blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <div className="flex items-start gap-4">
          {/* icon */}
          <div
            className={`shrink-0 w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${config.color}`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${config.badge}`}>
                {config.label}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{resource.subject}</span>
            </div>
            <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {resource.title}
            </CardTitle>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
          <span className="text-[10px] font-medium text-muted-foreground">
            {new Date(resource.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <div className="flex items-center gap-1.5">
             <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Active</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 relative">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {resource.description || "No description provided for this resource."}
        </p>

        <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground/80">
          <div className="flex items-center gap-1.5">
            <FileIcon className="w-3.5 h-3.5" />
            <span>{resource.fileSize}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <EyeIcon className="w-3.5 h-3.5" />
            <span>{resource.viewCount || 0} views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5" />
            <div className="flex gap-1">
              {resource.tags.slice(0, 2).map(tag => (
                <span key={tag} className="bg-muted px-1.5 py-0.5 rounded text-[9px]">{tag}</span>
              ))}
              {resource.tags.length > 2 && <span>+{resource.tags.length - 2}</span>}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 flex flex-col gap-3 relative">
        <div className="w-full h-px bg-border/50" />
        
        {/* actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleView}
            className="flex-1 h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5"
          >
            <EyeIcon className="w-3.5 h-3.5" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="flex-1 h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
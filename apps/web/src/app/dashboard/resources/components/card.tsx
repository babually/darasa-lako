"use client";

import type { ComponentType } from "react";
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
  TagIcon
} from "lucide-react";
import type { Prisma } from "@darasa-lako/db/client";

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

export function RCard({ resource }: { resource: Prisma.ResourceGetPayload<{ include: { uploader: true } }> }) {
  const config = typeConfig[resource.type] || defaultConfig;
  const Icon = config.icon;

  return (
    <Card className="group relative bg-[#0f1623] border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${config.accent} z-10`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-start gap-4">
          {/* icon */}
          <div
            className={`shrink-0 w-11 h-11 rounded-lg border flex items-center justify-center ${config.color}`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${config.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {config.label}
              </span>
              <span className="text-xs text-slate-500">{resource.subject}</span>
            </div>

            <CardTitle className="font-semibold text-white text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-slate-100 transition-colors">
              {resource.title}
            </CardTitle>

            <CardDescription className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
              {resource.description}
            </CardDescription>
          </div>
        </div>
        {/* <CardTitle>{resource.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button size="icon" variant="secondary" data-testid={`resource-menu-${resource.title}`}>
                <MenuIcon className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              data-testid={`update-${resource.title}`}
              onClick={() => resourcesState.setActiveResourceEditId(resource.id)}
            >
              <PencilIcon className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
              data-testid={`delete-${resource.title}`}
              onClick={() => resourcesState.deleteResource(resource.id)}
            >
              <TrashIcon className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {/* tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-white/5 rounded px-1.5 py-0.5"
              >
                <TagIcon className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* meta */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <FileIcon className="w-3.5 h-3.5" />
            {resource.fileSize}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <EyeIcon className="w-3.5 h-3.5" />
            {resource.viewCount} views
          </div>
          {/* {resource.dueDate && (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs ml-auto">
              <CalendarIcon className="w-3.5 h-3.5" />
              Due {new Date(resource.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )} */}
        </div>
        </CardContent>

        {/* uploaded by + date */}
        <CardFooter className="p-5 pt-0 flex-col items-stretch gap-3">
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-600">
            by {resource.uploader.name} ·{" "}
            {new Date(resource.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          {/* {isAdmin && (
            <span className="text-xs text-slate-600">
              {resource.assignedTo.length} student
              {resource.assignedTo.length !== 1 ? "s" : ""}
            </span>
          )} */}
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            // onClick={() => onView?.(resource)}
            className="flex-1 h-8 text-xs text-slate-400 hover:text-white hover:bg-white/5 gap-1.5"
          >
            <EyeIcon className="w-3.5 h-3.5" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            // onClick={() => onDownload?.(resource)}
            className="flex-1 h-8 text-xs text-slate-400 hover:text-white hover:bg-white/5 gap-1.5"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            Download
          </Button>
          {/* {(role === "admin") && resource.uploader.id === resourcesState.user?.id && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => resourcesState.setActiveResourceEditId(resource.id)}
              // onClick={() => onEdit(resource)}
              className="h-8 px-3 text-xs text-slate-400 hover:text-white hover:bg-white/5"
            >
              Edit
            </Button>
          )} */}
        </div>

        {/* {resource.description && (
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        )}

        <div className="flex gap-2 flex-wrap text-xs text-muted-foreground mt-2">
          {resource.subject && (
            <span className="bg-secondary px-2 py-1 rounded-md">{resource.subject}</span>
          )}
          {resource.grade && (
            <span className="bg-secondary px-2 py-1 rounded-md">{resource.grade}</span>
          )}
          {resource.type && (
            <span className="bg-secondary px-2 py-1 rounded-md">{resource.type}</span>
          )}
        </div> */}
      </CardFooter>
      </div>
    </Card>
  );
}
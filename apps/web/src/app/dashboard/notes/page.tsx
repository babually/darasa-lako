"use client"

import { useState } from "react";
import {
  BookOpenIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  SearchIcon,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@darasa-lako/ui/components/empty"
import { Button } from "@darasa-lako/ui/components/button";
import { Input } from "@darasa-lako/ui/components/input";
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
    const matchesSubject = subjectFilter === "all" || n.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  if (!resources) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center">
        <p className="text-slate-500">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center">
          <BookOpenIcon className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Notes</h1>
          <p className="text-slate-500 text-sm">{notes.length} notes assigned to you</p>
        </div>
      </div>

      {/* search + subject filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="pl-9 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubjectFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${subjectFilter === s
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600"
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
              className="border border-slate-100 rounded-xl p-5 hover:border-violet-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
                  <FileTextIcon className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{note.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs text-slate-400">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg border">
                      <BookOpenIcon className="w-3 h-3" />
                      {note.subject}
                    </span>
                    <span className="text-xs text-slate-400">
                      {note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(2)} MB` : "0 MB"}
                    </span>
                    <span className="text-xs text-slate-400">by {note.uploader.name}</span>
                    <div className="flex gap-1 flex-wrap ml-auto">
                      {note.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-slate-500 bg-white/5 rounded px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* actions */}
              <div className="flex gap-2 mt-4 pt-3">
                <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-slate-500 hover:text-violet-600 hover:bg-violet-50">
                  <EyeIcon className="w-3.5 h-3.5" /> Preview
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                  <DownloadIcon className="w-3.5 h-3.5" /> Download PDF
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
        // <div className="flex flex-col items-center justify-center py-20 text-center">
        //   <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4">
        //     <BookOpenIcon className="w-7 h-7 text-violet-300" />
        //   </div>
        //   <p className="text-slate-500 font-medium">No notes found</p>
        //   <p className="text-slate-400 text-sm mt-1">Your teacher hasn't assigned any notes yet</p>
        // </div>
      )}
    </div>
  );
}
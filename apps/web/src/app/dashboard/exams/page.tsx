"use client"

import {
  ClipboardListIcon,
  PlusIcon,
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
import { useResources } from "@/app/store/resource-state";
import { Input } from "@darasa-lako/ui/components/input";
import { useState } from "react";
import { ResourceCard } from "../resources/components/resource-card";

export default function ExamsPage() {
  const [search, setSearch] = useState("");

  const resourcesState = useResources();
  const { resources } = resourcesState;
  const exams = resources?.filter((r) => r.type === "exam") || [];
  const filtered = exams.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!resources) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center">
        <p className="text-slate-500">Loading exams...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
            <ClipboardListIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Exams</h1>
            <p className="text-slate-500 text-sm">
              Manage your exams here.
            </p>
          </div>
        </div>
        <Button
          onClick={() => resourcesState.setActiveResourceEditId("new")}
          className="bg-amber-600 hover:bg-amber-500 text-white border-0 gap-2 shadow-lg shadow-amber-500/20"
        >
          <PlusIcon className="w-4 h-4" />
          Add Exam
        </Button>
      </div>

      {/* search */}
      <div className="relative w-72">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exams..."
          className="pl-9 border-slate-200 text-slate-800  placeholder:text-slate-600 focus:border-amber-500/50"
        />
      </div>

      {/* all exams */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          All Exams ({filtered.length})
        </h2>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
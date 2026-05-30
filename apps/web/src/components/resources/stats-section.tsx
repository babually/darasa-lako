"use client"

import { FileText, ClipboardList, FolderOpen } from "lucide-react"

interface StatItemProps {
  icon: React.ReactNode
  count: number
  label: string
  bgColor: string
  textColor: string
}

function StatItem({ icon, count, label, bgColor, textColor }: StatItemProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgColor}`}>
      <span className={textColor}>{icon}</span>
      <span className={`text-sm font-semibold ${textColor}`}>{count}</span>
      <span className={`text-sm ${textColor}`}>{label}</span>
    </div>
  )
}

export function StatsSection() {
  return (
    <div className="flex justify-center items-center flex-wrap gap-3 mt-8">
      <StatItem
        icon={<FileText className="h-4 w-4" />}
        count={2}
        label="Notes"
        bgColor="bg-blue-100"
        textColor="text-blue-700"
      />
      <StatItem
        icon={<ClipboardList className="h-4 w-4" />}
        count={2}
        label="Exams"
        bgColor="bg-orange-100"
        textColor="text-orange-700"
      />
      <StatItem
        icon={<FolderOpen className="h-4 w-4" />}
        count={2}
        label="Resources"
        bgColor="bg-emerald-100"
        textColor="text-emerald-700"
      />
    </div>
  )
}
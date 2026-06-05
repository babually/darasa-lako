"use client";

import { ClipboardList, FileText, FolderOpen } from "lucide-react";

interface StatItemProps {
	icon: React.ReactNode;
	count: number;
	label: string;
	bgColor: string;
	textColor: string;
}

function StatItem({ icon, count, label, bgColor, textColor }: StatItemProps) {
	return (
		<div
			className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${bgColor}`}
		>
			<span className={textColor}>{icon}</span>
			<span className={`font-semibold text-sm ${textColor}`}>{count}</span>
			<span className={`text-sm ${textColor}`}>{label}</span>
		</div>
	);
}

export function StatsSection() {
	return (
		<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
	);
}

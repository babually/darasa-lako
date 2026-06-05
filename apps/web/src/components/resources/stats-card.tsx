import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
	label: string;
	value: number | string;
	icon: LucideIcon;
	trend?: number;
	color?: "violet" | "cyan" | "amber" | "emerald" | "rose";
}

const colorConfig = {
	violet: {
		icon: "bg-violet-500/10 text-violet-400",
		glow: "shadow-violet-500/5",
		border: "border-violet-500/10",
		trend: "text-violet-300",
	},
	cyan: {
		icon: "bg-cyan-500/10 text-cyan-400",
		glow: "shadow-cyan-500/5",
		border: "border-cyan-500/10",
		trend: "text-cyan-300",
	},
	amber: {
		icon: "bg-amber-500/10 text-amber-400",
		glow: "shadow-amber-500/5",
		border: "border-amber-500/10",
		trend: "text-amber-300",
	},
	emerald: {
		icon: "bg-emerald-500/10 text-emerald-400",
		glow: "shadow-emerald-500/5",
		border: "border-emerald-500/10",
		trend: "text-emerald-300",
	},
	rose: {
		icon: "bg-rose-500/10 text-rose-400",
		glow: "shadow-rose-500/5",
		border: "border-rose-500/10",
		trend: "text-rose-300",
	},
};

export default function StatsCard({
	label,
	value,
	icon: Icon,
	trend,
	color = "violet",
}: StatsCardProps) {
	const cfg = colorConfig[color];

	return (
		<div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20">
			<div className="mb-3 flex items-center justify-between">
				<div
					className={`h-10 w-10 ${cfg.icon} flex items-center justify-center rounded-lg`}
				>
					<Icon className="h-5 w-5" />
				</div>
				{trend !== undefined && (
					<span
						className={`rounded-full px-1.5 py-0.5 font-medium text-[10px] ${trend >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
					>
						{trend > 0 ? "+" : ""}
						{trend}%
					</span>
				)}
			</div>
			<div>
				<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
					{label}
				</p>
				<h3 className="mt-1 font-bold text-2xl text-foreground">
					{typeof value === "number" ? value.toLocaleString() : value}
				</h3>
			</div>
		</div>
	);
}

import { 
    TrendingDownIcon, 
    TrendingUpIcon, 
    type LucideIcon
} from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  color?: "violet" | "cyan" | "amber" | "emerald" | "rose";
  suffix?: string;
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
  suffix,
}: StatsCardProps) {
  const cfg = colorConfig[color];

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${cfg.icon} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-foreground mt-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
      </div>
    </div>
  );
}
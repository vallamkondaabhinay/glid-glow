import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon: LucideIcon;
  subtext?: string;
  sparklineData?: number[];
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  delta,
  icon: Icon,
  subtext,
  sparklineData = [24, 28, 25, 32, 30, 36, 42],
}) => {
  // Generate lightweight SVG sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl p-5 border border-[#C7A56A]/25 shadow-xs hover:border-[#C7A56A]/50 transition-all duration-300 flex flex-col justify-between">
      {/* Top row: Label & Icon */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs uppercase tracking-wider text-[#8A7D84] font-medium">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#FBF7F1] border border-[#C7A56A]/30 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#4A2038]" />
        </div>
      </div>

      {/* Center: Big Value */}
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-3xl font-serif font-bold text-[#281522] tracking-tight tabular-nums">
          {value}
        </span>

        {/* Sparkline */}
        <div className="shrink-0 hidden sm:block">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke="#C7A56A"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Bottom row: Delta comparison indicator */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#FBF7F1]">
        {delta ? (
          <div className="flex items-center gap-1.5 font-medium tabular-nums">
            {delta.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            )}
            <span className={delta.isPositive ? 'text-emerald-700' : 'text-amber-700'}>
              {delta.value}
            </span>
            <span className="text-[#8A7D84] text-[11px]">
              {delta.label || 'vs last period'}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-[#8A7D84]">{subtext}</span>
        )}
      </div>
    </div>
  );
};

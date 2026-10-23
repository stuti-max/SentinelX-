import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  deltaPercent?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  subtext?: string;
  icon: React.ReactNode;
  statusColor?: 'cyan' | 'red' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  isSimulated?: boolean;
  alertBadge?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  deltaPercent,
  trend,
  trendLabel,
  subtext,
  icon,
  statusColor = 'rose',
  isSimulated,
  alertBadge,
}) => {
  const getAccentBarColor = () => {
    switch (statusColor) {
      case 'red':
        return 'bg-[#DC2626]';
      case 'emerald':
        return 'bg-[#16A34A]';
      case 'amber':
        return 'bg-[#D97706]';
      case 'rose':
      default:
        return 'bg-[#D99A9A]';
    }
  };

  const getIconContainerStyle = () => {
    switch (statusColor) {
      case 'red':
        return 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]';
      case 'emerald':
        return 'text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]';
      case 'amber':
        return 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]';
      case 'rose':
      default:
        return 'text-[#9A5050] bg-[#FDF7F7] border-[#F2DEDE]';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-[#F2DEDE] hover:border-[#D99A9A] p-4 transition-all duration-150 shadow-card hover:shadow-card-hover group">
      {/* Top thin accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${getAccentBarColor()}`} />

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold tracking-wider text-[#70777B] uppercase font-mono">
              {title}
            </span>
            {isSimulated && (
              <span className="text-[9px] font-mono font-semibold text-[#9A5050] px-1 py-0.2 rounded border border-[#F2DEDE] bg-[#FDF7F7]">
                SIM
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#303437] font-mono">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className="text-xs font-semibold text-[#70777B] font-mono">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2 rounded-lg border ${getIconContainerStyle()} shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#F7EBEB] flex items-center justify-between text-[11px] text-[#70777B]">
        <div className="flex items-center gap-1.5">
          {deltaPercent !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-mono font-bold text-[11px] ${
                trend === 'up'
                  ? statusColor === 'red' ? 'text-red-600' : 'text-green-700'
                  : trend === 'down'
                  ? statusColor === 'red' ? 'text-green-700' : 'text-amber-700'
                  : 'text-[#70777B]'
              }`}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              {deltaPercent > 0 ? `+${deltaPercent}%` : `${deltaPercent}%`}
            </span>
          )}

          {trendLabel && (
            <span className="font-mono text-[#303437] font-semibold">
              {trendLabel}
            </span>
          )}

          {subtext && !trendLabel && (
            <span className="truncate max-w-[170px] text-[#8E969B] text-[10px]" title={subtext}>
              {subtext}
            </span>
          )}
        </div>

        {alertBadge && (
          <div>{alertBadge}</div>
        )}
      </div>
    </div>
  );
};

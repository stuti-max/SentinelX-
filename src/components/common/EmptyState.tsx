import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Security Events Found',
  description = 'No security events match the active search query or filter parameters. Try expanding your filter criteria.',
  onReset,
  actionText = 'Reset Filters',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#F2DEDE] bg-white my-3 shadow-card">
      <div className="w-10 h-10 rounded-full bg-[#FDF7F7] border border-[#F2DEDE] flex items-center justify-center mb-2.5">
        <ShieldAlert className="w-5 h-5 text-[#D99A9A]" />
      </div>
      <h3 className="text-sm font-semibold text-[#303437] font-mono">
        {title}
      </h3>
      <p className="text-xs text-[#70777B] mt-1 max-w-md">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-white bg-[#D99A9A] hover:bg-[#C88888] transition-colors shadow-sm"
        >
          <RotateCcw className="w-3 h-3" />
          {actionText}
        </button>
      )}
    </div>
  );
};

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'API Connectivity Issue',
  message = 'Failed to fetch telemetry from the remote endpoint. Dashboard has fallen back to safe simulated demo mode.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-3.5 rounded-xl border border-red-200 bg-[#FEF2F2] text-[#303437] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-card ${className}`}>
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 shrink-0 shadow-sm">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-red-800 font-mono">
            {title}
          </h4>
          <p className="text-[11px] text-red-700/80 mt-0.5">
            {message}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-white bg-[#D99A9A] hover:bg-[#C88888] shadow-sm transition-colors shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          Retry Connection
        </button>
      )}
    </div>
  );
};

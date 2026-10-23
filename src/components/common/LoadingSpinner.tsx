import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subtext?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading Security Telemetry...',
  subtext = 'Synchronizing with ingestion pipeline and AKS cluster metrics',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-[260px] text-center">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full border-2 border-[#F2DEDE] border-t-[#D99A9A] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#D99A9A] animate-pulse" />
        </div>
      </div>
      <h3 className="text-xs font-semibold text-[#303437] tracking-wide font-mono">
        {message}
      </h3>
      <p className="text-[11px] text-[#70777B] mt-1 max-w-sm">
        {subtext}
      </p>
    </div>
  );
};

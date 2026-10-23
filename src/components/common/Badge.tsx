import React from 'react';
import { Severity, EventStatus } from '../../types/security';
import { ServiceHealthStatus } from '../../types/telemetry';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'severity' | 'status' | 'health' | 'method' | 'default';
  severity?: Severity;
  status?: EventStatus;
  health?: ServiceHealthStatus;
  method?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  severity,
  status,
  health,
  method,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.2 text-[10px] font-mono' : 'px-2 py-0.5 text-xs font-mono font-medium';

  // Severity variants
  if (severity || variant === 'severity') {
    const sev = severity || (children as Severity);
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className={`inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 text-red-700 font-semibold uppercase tracking-wider ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            {children || sev}
          </span>
        );
      case 'HIGH':
        return (
          <span className={`inline-flex items-center gap-1 rounded border border-orange-200 bg-orange-50 text-orange-700 font-semibold uppercase tracking-wider ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            {children || sev}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className={`inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 text-amber-800 font-semibold uppercase tracking-wider ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {children || sev}
          </span>
        );
      case 'LOW':
        return (
          <span className={`inline-flex items-center gap-1 rounded border border-[#E4BFBF] bg-[#FDF7F7] text-[#9A5050] font-semibold uppercase tracking-wider ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D99A9A]"></span>
            {children || sev}
          </span>
        );
      case 'INFORMATIONAL':
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 text-slate-700 font-medium uppercase tracking-wider ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {children || sev || 'INFO'}
          </span>
        );
    }
  }

  // Event Status variants
  if (status || variant === 'status') {
    const st = status || (children as EventStatus);
    switch (st) {
      case 'BLOCKED':
        return (
          <span className={`inline-flex items-center rounded border border-red-200 bg-red-50 text-red-700 font-medium ${sizeClasses} ${className}`}>
            Blocked
          </span>
        );
      case 'MITIGATED':
        return (
          <span className={`inline-flex items-center rounded border border-green-200 bg-green-50 text-green-700 font-medium ${sizeClasses} ${className}`}>
            Mitigated
          </span>
        );
      case 'INVESTIGATING':
        return (
          <span className={`inline-flex items-center rounded border border-amber-200 bg-amber-50 text-amber-800 font-medium ${sizeClasses} ${className}`}>
            Investigating
          </span>
        );
      case 'OPEN':
      default:
        return (
          <span className={`inline-flex items-center rounded border border-[#E4BFBF] bg-[#FDF7F7] text-[#9A5050] font-medium ${sizeClasses} ${className}`}>
            Open
          </span>
        );
    }
  }

  // Service Health variants
  if (health || variant === 'health') {
    const hl = health || (children as ServiceHealthStatus);
    switch (hl) {
      case 'HEALTHY':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Healthy
          </span>
        );
      case 'DEGRADED':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Degraded
          </span>
        );
      case 'DOWN':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
            Offline
          </span>
        );
    }
  }

  // HTTP Method
  if (method || variant === 'method') {
    const m = (method || children)?.toString().toUpperCase();
    const color = m === 'POST' ? 'text-amber-800 border-amber-200 bg-amber-50'
      : m === 'GET' ? 'text-[#9A5050] border-[#E4BFBF] bg-[#FDF7F7]'
      : m === 'PUT' ? 'text-purple-700 border-purple-200 bg-purple-50'
      : m === 'DELETE' ? 'text-red-700 border-red-200 bg-red-50'
      : 'text-[#303437] border-slate-200 bg-slate-50';
    return (
      <span className={`inline-flex items-center font-mono font-semibold rounded border ${color} ${sizeClasses} ${className}`}>
        {m}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded border border-slate-200 bg-white text-[#303437] ${sizeClasses} ${className}`}>
      {children}
    </span>
  );
};

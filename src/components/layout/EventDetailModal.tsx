import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Ban, 
  Clock, 
  Globe, 
  Server, 
  Copy, 
  Check, 
  ExternalLink,
  Terminal,
  AlertCircle
} from 'lucide-react';
import { SecurityEvent, EventStatus } from '../../types/security';
import { Badge } from '../common/Badge';
import { TelemetryTag } from '../common/TelemetryTag';

interface EventDetailModalProps {
  event: SecurityEvent | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: EventStatus) => Promise<void>;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onUpdateStatus,
}) => {
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!event) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (status: EventStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(event.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#34383A]/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal Dialog Card */}
      <div 
        className="w-full max-w-2xl max-h-[90vh] bg-white border border-[#D8DFE2] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#E9EEF0] flex items-center justify-between bg-[#F8FAFB] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white border border-[#D8DFE2] text-[#D99A9A] shadow-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#303437] font-mono">{event.id}</span>
                <Badge severity={event.severity} size="sm" />
                <Badge status={event.status} size="sm" />
              </div>
              <h2 className="text-xs font-semibold text-[#70777B] mt-0.5">
                {event.eventType}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyJson}
              title="Copy Event JSON"
              className="p-1.5 rounded-lg text-[#70777B] hover:text-[#303437] hover:bg-white transition-colors border border-transparent hover:border-[#D8DFE2]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#70777B] hover:text-[#303437] hover:bg-white transition-colors border border-transparent hover:border-[#D8DFE2]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Simulation disclaimer banner */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#F2DEDE] bg-[#FDF7F7]">
            <div className="flex items-center gap-2 text-[#9A5050]">
              <TelemetryTag type="simulated" />
              <span className="font-medium text-[11px]">Simulated SOC demonstration event for defense testing.</span>
            </div>
            <span className="text-[10px] font-mono text-[#D99A9A] font-semibold">Synthetic Ingest</span>
          </div>

          {/* Incident Description */}
          <div className="p-3 rounded-lg bg-[#F8FAFB] border border-[#E9EEF0] space-y-1">
            <div className="text-[10px] font-mono font-bold text-[#70777B] uppercase tracking-wider">
              Incident Summary & Context
            </div>
            <p className="text-[#303437] text-xs leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Source Information */}
            <div className="p-3.5 rounded-lg bg-white border border-[#E9EEF0] shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#303437] uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-[#D99A9A]" />
                Source Telemetry
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-[#F4F7F8]">
                  <span className="text-[#70777B] font-mono">Source IP</span>
                  <span className="text-[#303437] font-mono font-bold">{event.sourceIp}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#F4F7F8]">
                  <span className="text-[#70777B] font-mono">Geo Location</span>
                  <span className="text-[#303437] font-medium">
                    {event.sourceGeo.city}, {event.sourceGeo.country} ({event.sourceGeo.countryCode})
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#F4F7F8]">
                  <span className="text-[#70777B] font-mono">Threat Label</span>
                  <span className="text-[#303437] font-medium">{event.sourceLabel}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#70777B] font-mono">Detected</span>
                  <span className="text-[#303437] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D99A9A]" />
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Target & Protocol Information */}
            <div className="p-3.5 rounded-lg bg-white border border-[#E9EEF0] shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#303437] uppercase tracking-wider">
                <Server className="w-3.5 h-3.5 text-[#D99A9A]" />
                Target & Rule Matching
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-[#F4F7F8]">
                  <span className="text-[#70777B] font-mono">Target Endpoint</span>
                  <span className="text-[#9A5050] font-mono font-bold">{event.targetEndpoint}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#F4F7F8]">
                  <span className="text-[#70777B] font-mono">HTTP Method</span>
                  <Badge method={event.httpMethod} size="sm" />
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#F4F7F8]">
                  <span className="text-[#70777B] font-mono">Status Code</span>
                  <span className="font-mono font-bold text-[#303437]">{event.statusCode}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#70777B] font-mono">Security Rule</span>
                  <span className="text-[#303437] font-mono text-[10px] truncate max-w-[170px]" title={event.ruleTriggered}>
                    {event.ruleTriggered}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Mapping */}
          <div className="p-3.5 rounded-lg bg-white border border-[#E9EEF0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#303437] uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-[#D99A9A]" />
                MITRE ATT&CK Mapping
              </div>
              <a
                href={`https://attack.mitre.org/techniques/${event.mitreTechnique.id.replace('.', '/')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-mono text-[#D99A9A] font-semibold hover:text-[#C88888] transition-colors"
              >
                <span>View Technique</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 text-xs">
              <div className="p-2 rounded bg-[#F8FAFB] border border-[#E9EEF0]">
                <span className="text-[9px] text-[#70777B] uppercase font-mono block">Technique ID</span>
                <span className="font-mono font-bold text-[#303437]">{event.mitreTechnique.id}</span>
              </div>
              <div className="p-2 rounded bg-[#F8FAFB] border border-[#E9EEF0]">
                <span className="text-[9px] text-[#70777B] uppercase font-mono block">Technique Name</span>
                <span className="font-medium text-[#303437]">{event.mitreTechnique.name}</span>
              </div>
              <div className="p-2 rounded bg-[#F8FAFB] border border-[#E9EEF0]">
                <span className="text-[9px] text-[#70777B] uppercase font-mono block">Tactic</span>
                <span className="font-mono font-semibold text-[#9A5050]">{event.mitreTechnique.tactic}</span>
              </div>
            </div>
          </div>

          {/* Raw Payload Preview */}
          {event.rawPayloadSample && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#70777B]">
                <span className="font-semibold">Intercepted Payload Sample</span>
                <span className="text-[9px] bg-[#FDF7F7] px-1.5 py-0.2 rounded border border-[#F2DEDE] text-[#9A5050]">Sanitized</span>
              </div>
              <pre className="p-3 rounded-lg bg-[#F8FAFB] border border-[#E9EEF0] font-mono text-[11px] text-[#303437] overflow-x-auto whitespace-pre-wrap break-all max-h-32">
                {event.rawPayloadSample}
              </pre>
            </div>
          )}

          {/* User Agent */}
          {event.userAgent && (
            <div className="text-[11px] font-mono text-[#303437] flex items-center gap-2 bg-[#F8FAFB] p-2 rounded-lg border border-[#E9EEF0]">
              <span className="text-[#70777B] shrink-0 font-semibold">User-Agent:</span>
              <span className="truncate text-[#303437]">{event.userAgent}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[#E9EEF0] bg-[#F8FAFB] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#303437] font-semibold mr-1">Triage:</span>
            <button
              disabled={isUpdating || event.status === 'MITIGATED'}
              onClick={() => handleStatusChange('MITIGATED')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-40"
            >
              <ShieldCheck className="w-3 h-3" />
              Mitigate
            </button>
            <button
              disabled={isUpdating || event.status === 'BLOCKED'}
              onClick={() => handleStatusChange('BLOCKED')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-40"
            >
              <Ban className="w-3 h-3" />
              Block IP
            </button>
            <button
              disabled={isUpdating || event.status === 'INVESTIGATING'}
              onClick={() => handleStatusChange('INVESTIGATING')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors disabled:opacity-40"
            >
              <AlertCircle className="w-3 h-3" />
              Investigate
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md text-[11px] font-mono font-semibold text-[#303437] bg-white border border-[#D8DFE2] hover:bg-[#E9EEF0] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

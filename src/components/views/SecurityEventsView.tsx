import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Zap, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { Severity, EventStatus } from '../../types/security';
import { RecentEventsTable } from '../dashboard/RecentEventsTable';
import { TelemetryTag } from '../common/TelemetryTag';

export const SecurityEventsView: React.FC = () => {
  const { 
    events, 
    setSelectedEvent, 
    simulateIncomingEvent, 
    refreshData, 
    isLoading 
  } = useDashboard();

  const [activeSeverityPill, setActiveSeverityPill] = useState<Severity | 'ALL'>('ALL');
  const [activeStatusPill, setActiveStatusPill] = useState<EventStatus | 'ALL'>('ALL');

  // Filter events based on active pills
  const filteredEvents = events.filter(e => {
    const sevMatch = activeSeverityPill === 'ALL' || e.severity === activeSeverityPill;
    const statMatch = activeStatusPill === 'ALL' || e.status === activeStatusPill;
    return sevMatch && statMatch;
  });

  const criticalCount = events.filter(e => e.severity === 'CRITICAL').length;
  const unmitigatedCount = events.filter(e => e.status === 'OPEN' || e.status === 'INVESTIGATING').length;
  const blockedCount = events.filter(e => e.status === 'BLOCKED' || e.status === 'MITIGATED').length;

  return (
    <div className="space-y-6">
      {/* Header & Simulation Injection Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-pink-100 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-plum font-mono flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-pink" />
              Security Event Log & Incident Triage
            </h2>
            <TelemetryTag type="simulated" />
          </div>
          <p className="text-xs text-plum-muted mt-1 max-w-2xl leading-relaxed">
            Real-time feed of simulated security probes, WAF violations, rate limit events, and credential stuffing attempts. Click any row to inspect HTTP headers, payloads, and MITRE ATT&CK techniques.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => refreshData()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-plum bg-white border border-pink-200 hover:bg-rose-pink-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-pink ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Log
          </button>

          <button
            onClick={simulateIncomingEvent}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-rose-pink hover:bg-rose-pink-500 shadow-sm transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-white" />
            + Simulate New Event
          </button>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-plum-muted font-medium">Total Stream Events</span>
            <div className="text-2xl font-bold text-plum font-mono mt-0.5">{events.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-pink-50 border border-pink-100 text-rose-pink">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-plum-muted font-medium">Critical / Requiring Triage</span>
            <div className="text-2xl font-bold text-rose-600 font-mono mt-0.5">{criticalCount} ({unmitigatedCount} Open)</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-plum-muted font-medium">Defended / Mitigated</span>
            <div className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">
              {blockedCount} ({Math.round((blockedCount / Math.max(1, events.length)) * 100)}%)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pill Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-pink-100 shadow-card">
        {/* Severity filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-plum-muted font-semibold mr-1">Severity:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setActiveSeverityPill(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeSeverityPill === sev
                  ? 'bg-rose-pink text-white shadow-sm'
                  : 'bg-baby-pink text-plum hover:bg-rose-pink-50 border border-pink-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-plum-muted font-semibold mr-1">Status:</span>
          {(['ALL', 'OPEN', 'INVESTIGATING', 'MITIGATED', 'BLOCKED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setActiveStatusPill(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeStatusPill === st
                  ? 'bg-rose-pink text-white shadow-sm'
                  : 'bg-baby-pink text-plum hover:bg-rose-pink-50 border border-pink-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated Table */}
      <RecentEventsTable
        events={filteredEvents}
        onSelectEvent={setSelectedEvent}
        title="Filtered Security Stream"
        subtitle={`Showing ${filteredEvents.length} simulated events based on active triage parameters`}
        pageSize={10}
        showFilters={true}
      />
    </div>
  );
};

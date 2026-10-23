import React from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Cpu 
} from 'lucide-react';
import { DashboardKPIs } from '../../types/dashboard';
import { MetricCard } from '../common/MetricCard';

interface KpiGridProps {
  kpis: DashboardKPIs | null;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis }) => {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white border border-[#F2DEDE] shadow-card animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Total Security Events */}
      <MetricCard
        title="Total Security Events"
        value={kpis.totalEvents.value}
        deltaPercent={kpis.totalEvents.deltaPercent}
        trend={kpis.totalEvents.trend}
        subtext={kpis.totalEvents.subtext}
        icon={<Activity className="w-4 h-4" />}
        statusColor="rose"
        isSimulated={true}
      />

      {/* 2. Critical Events */}
      <MetricCard
        title="Critical Events"
        value={kpis.criticalEvents.value}
        deltaPercent={kpis.criticalEvents.deltaPercent}
        trend={kpis.criticalEvents.trend}
        subtext={kpis.criticalEvents.subtext}
        icon={<AlertOctagon className="w-4 h-4" />}
        statusColor="red"
        isSimulated={true}
        alertBadge={
          kpis.criticalEvents.unmitigatedCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
              {kpis.criticalEvents.unmitigatedCount} Unmitigated
            </span>
          ) : undefined
        }
      />

      {/* 3. Requests / Min */}
      <MetricCard
        title="Requests / Min"
        value={kpis.requestsPerMinute.value}
        unit="RPM"
        deltaPercent={kpis.requestsPerMinute.deltaPercent}
        trend={kpis.requestsPerMinute.trend}
        subtext={kpis.requestsPerMinute.subtext}
        icon={<ShieldAlert className="w-4 h-4" />}
        statusColor="rose"
      />

      {/* 4. P95 API Latency */}
      <MetricCard
        title="P95 API Latency"
        value={kpis.p95LatencyMs.value}
        unit="ms"
        deltaPercent={kpis.p95LatencyMs.deltaPercent}
        trend={kpis.p95LatencyMs.trend}
        subtext={kpis.p95LatencyMs.subtext}
        icon={<Clock className="w-4 h-4" />}
        statusColor={kpis.p95LatencyMs.isWithinSla ? 'emerald' : 'amber'}
        alertBadge={
          <span className="text-[9px] font-mono text-green-700 font-bold bg-green-50 px-1.5 py-0.2 rounded border border-green-200">
            SLA Met
          </span>
        }
      />

      {/* 5. Availability */}
      <MetricCard
        title="Availability"
        value={`${kpis.serviceAvailability.valuePercent}%`}
        trend="up"
        trendLabel="30d SLA"
        subtext={kpis.serviceAvailability.subtext}
        icon={<CheckCircle2 className="w-4 h-4" />}
        statusColor="emerald"
      />

      {/* 6. Active API Replicas */}
      <MetricCard
        title="Active Replicas"
        value={`${kpis.activeApiReplicas.active} / ${kpis.activeApiReplicas.desired}`}
        trend="neutral"
        trendLabel="HPA 2-8"
        subtext={kpis.activeApiReplicas.subtext}
        icon={<Cpu className="w-4 h-4" />}
        statusColor="rose"
      />
    </div>
  );
};

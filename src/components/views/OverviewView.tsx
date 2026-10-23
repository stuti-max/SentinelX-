import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { KpiGrid } from '../dashboard/KpiGrid';
import { EventsTimeChart } from '../dashboard/EventsTimeChart';
import { SeverityDonut } from '../dashboard/SeverityDonut';
import { RequestRateChart } from '../dashboard/RequestRateChart';
import { LatencyChart } from '../dashboard/LatencyChart';
import { RecentEventsTable } from '../dashboard/RecentEventsTable';
import { InfraHealthPanel } from '../dashboard/InfraHealthPanel';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorBanner } from '../common/ErrorBanner';

export const OverviewView: React.FC = () => {
  const { 
    kpis, 
    events, 
    timelineData, 
    severityData, 
    requestRateData, 
    latencyData, 
    services, 
    cluster, 
    isLoading, 
    isError, 
    errorMessage, 
    refreshData,
    setSelectedEvent 
  } = useDashboard();

  if (isLoading && !kpis) {
    return <LoadingSpinner message="Initializing SentinelX Security Console..." />;
  }

  if (isError && !kpis) {
    return (
      <div className="p-4">
        <ErrorBanner 
          title="Telemetry API Unreachable" 
          message={errorMessage || 'An error occurred while communicating with the telemetry API.'} 
          onRetry={refreshData} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* 1. Primary SOC KPIs in neat compact grid */}
      <section aria-label="Key Performance Indicators">
        <KpiGrid kpis={kpis} />
      </section>

      {/* 2. Security Events Timeline & Severity Distribution Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3.5" aria-label="Security Metrics Charts">
        <div className="lg:col-span-2">
          <EventsTimeChart data={timelineData} />
        </div>
        <div className="lg:col-span-1">
          <SeverityDonut data={severityData} />
        </div>
      </section>

      {/* 3. HTTP Request Rate & API Latency SLA Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3.5" aria-label="Telemetry Throughput and Latency">
        <RequestRateChart data={requestRateData} />
        <LatencyChart data={latencyData} />
      </section>

      {/* 4. Infrastructure Health Panel (Frontend, API, Redis, Worker) */}
      <section aria-label="Infrastructure Health Status">
        <InfraHealthPanel services={services} cluster={cluster} />
      </section>

      {/* 5. Recent Security Events Table */}
      <section aria-label="Recent Security Incident Table">
        <RecentEventsTable 
          events={events} 
          onSelectEvent={setSelectedEvent} 
          pageSize={6}
        />
      </section>
    </div>
  );
};

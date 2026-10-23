export type NavigationTab = 'overview' | 'events' | 'analytics' | 'infrastructure' | 'settings';

export interface DashboardKPIs {
  totalEvents: {
    value: number;
    deltaPercent: number;
    trend: 'up' | 'down' | 'neutral';
    subtext: string;
  };
  criticalEvents: {
    value: number;
    deltaPercent: number;
    unmitigatedCount: number;
    trend: 'up' | 'down' | 'neutral';
    subtext: string;
  };
  requestsPerMinute: {
    value: number;
    deltaPercent: number;
    peakRpm: number;
    trend: 'up' | 'down' | 'neutral';
    subtext: string;
  };
  p95LatencyMs: {
    value: number;
    slaThresholdMs: number;
    isWithinSla: boolean;
    deltaPercent: number;
    trend: 'up' | 'down' | 'neutral';
    subtext: string;
  };
  serviceAvailability: {
    valuePercent: number;
    targetPercent: number;
    isMeetingTarget: boolean;
    downtimeMinutes30d: number;
    subtext: string;
  };
  activeApiReplicas: {
    active: number;
    desired: number;
    hpaMin: number;
    hpaMax: number;
    isHealthy: boolean;
    subtext: string;
  };
}

export interface SecurityEventsTimePoint {
  time: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface SeverityDistributionPoint {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface RequestRatePoint {
  time: string;
  rpm: number;
  successRate: number;
  blockedRate: number;
}

export interface LatencyTrendPoint {
  time: string;
  p50: number;
  p95: number;
  p99: number;
  slaLimit: number;
}

export interface AttackVectorPoint {
  category: string;
  count: number;
  percentage: number;
}

export interface TargetedEndpointPoint {
  endpoint: string;
  method: string;
  attempts: number;
  blocked: number;
  lastAttempt: string;
}

export interface GeoDistributionPoint {
  country: string;
  code: string;
  events: number;
  criticalCount: number;
}

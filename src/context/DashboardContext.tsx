import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SecurityEvent, EventFilterState, EventStatus } from '../types/security';
import { ServiceComponent, ClusterTelemetry } from '../types/telemetry';
import { 
  DashboardKPIs, 
  SecurityEventsTimePoint, 
  SeverityDistributionPoint, 
  RequestRatePoint, 
  LatencyTrendPoint,
  NavigationTab 
} from '../types/dashboard';
import { apiService, ApiStatus } from '../services/api';

interface DashboardContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  kpis: DashboardKPIs | null;
  events: SecurityEvent[];
  timelineData: SecurityEventsTimePoint[];
  severityData: SeverityDistributionPoint[];
  requestRateData: RequestRatePoint[];
  latencyData: LatencyTrendPoint[];
  services: ServiceComponent[];
  cluster: ClusterTelemetry | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  apiStatus: ApiStatus | null;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  selectedEvent: SecurityEvent | null;
  setSelectedEvent: (event: SecurityEvent | null) => void;
  refreshData: () => Promise<void>;
  simulateIncomingEvent: () => void;
  updateEventStatus: (id: string, status: EventStatus) => Promise<void>;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  filters: EventFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EventFilterState>>;
  notificationMessage: string | null;
  clearNotification: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [timelineData, setTimelineData] = useState<SecurityEventsTimePoint[]>([]);
  const [severityData, setSeverityData] = useState<SeverityDistributionPoint[]>([]);
  const [requestRateData, setRequestRateData] = useState<RequestRatePoint[]>([]);
  const [latencyData, setLatencyData] = useState<LatencyTrendPoint[]>([]);
  const [services, setServices] = useState<ServiceComponent[]>([]);
  const [cluster, setCluster] = useState<ClusterTelemetry | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [demoMode, setDemoModeState] = useState<boolean>(apiService.isDemoMode());
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<EventFilterState>({
    searchQuery: '',
    severity: 'ALL',
    status: 'ALL',
    category: '',
    timeRange: '24h',
  });

  const clearNotification = useCallback(() => {
    setNotificationMessage(null);
  }, []);

  const setDemoMode = (val: boolean) => {
    apiService.setDemoMode(val);
    setDemoModeState(val);
    loadAllData();
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      const [
        kpisRes,
        eventsRes,
        timelineRes,
        severityRes,
        reqRateRes,
        latencyRes,
        servicesRes,
        clusterRes,
        healthRes,
      ] = await Promise.all([
        apiService.getDashboardKPIs(),
        apiService.getSecurityEvents(filters),
        apiService.getSecurityEventsTimeline(),
        apiService.getSeverityDistribution(),
        apiService.getRequestRateMetrics(),
        apiService.getLatencyMetrics(),
        apiService.getInfrastructureStatus(),
        apiService.getClusterTelemetry(),
        apiService.checkApiHealth(),
      ]);

      setKpis(kpisRes);
      setEvents(eventsRes.events);
      setTimelineData(timelineRes);
      setSeverityData(severityRes);
      setRequestRateData(reqRateRes);
      setLatencyData(latencyRes);
      setServices(servicesRes);
      setCluster(clusterRes);
      setApiStatus(healthRes);
    } catch (err: unknown) {
      setIsError(true);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Periodic polling if autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // Background re-poll without full loading spinner
      Promise.all([
        apiService.getDashboardKPIs().then(setKpis),
        apiService.getSecurityEvents(filters).then(res => setEvents(res.events)),
        apiService.checkApiHealth().then(setApiStatus),
      ]).catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, filters]);

  const simulateIncomingEvent = () => {
    const newEv = apiService.simulateNewSecurityEvent();
    setEvents(prev => [newEv, ...prev]);
    // update KPIs
    if (kpis) {
      setKpis({
        ...kpis,
        totalEvents: {
          ...kpis.totalEvents,
          value: kpis.totalEvents.value + 1,
        },
        criticalEvents: newEv.severity === 'CRITICAL' ? {
          ...kpis.criticalEvents,
          value: kpis.criticalEvents.value + 1,
          unmitigatedCount: kpis.criticalEvents.unmitigatedCount + 1,
        } : kpis.criticalEvents,
      });
    }
    setNotificationMessage(`Simulated Event Ingested: ${newEv.eventType} (${newEv.severity}) from ${newEv.sourceIp}`);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const updateEventStatus = async (id: string, status: EventStatus) => {
    const updated = await apiService.updateEventStatus(id, status);
    if (updated) {
      setEvents(prev => prev.map(e => (e.id === id ? updated : e)));
      if (selectedEvent?.id === id) {
        setSelectedEvent(updated);
      }
      setNotificationMessage(`Event ${id} status marked as ${status}`);
      setTimeout(() => setNotificationMessage(null), 4000);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
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
        apiStatus,
        demoMode,
        setDemoMode,
        selectedEvent,
        setSelectedEvent,
        refreshData: loadAllData,
        simulateIncomingEvent,
        updateEventStatus,
        autoRefresh,
        setAutoRefresh,
        filters,
        setFilters,
        notificationMessage,
        clearNotification,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

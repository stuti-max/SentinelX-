export type ServiceHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export interface ServiceComponent {
  id: string;
  name: string;
  role: string;
  type: 'frontend' | 'api' | 'redis' | 'worker';
  status: ServiceHealthStatus;
  statusMessage: string;
  cpuPercent: number;
  cpuLimit: string;
  memoryUsageMB: number;
  memoryLimitMB: number;
  activeReplicas: number;
  desiredReplicas: number;
  podRestarts: number;
  uptime: string;
  version: string;
  containerImage: string;
  lastHealthCheck: string;
}

export interface ClusterTelemetry {
  clusterName: string;
  region: string;
  k8sVersion: string;
  nodePoolCount: number;
  totalNodes: number;
  healthyNodes: number;
  totalPods: number;
  runningPods: number;
  clusterCpuUsagePercent: number;
  clusterMemoryUsagePercent: number;
  redisMetrics: {
    connectedClients: number;
    usedMemoryMB: number;
    peakMemoryMB: number;
    hitRatePercent: number;
    opsPerSecond: number;
    evictedKeys: number;
  };
  isSimulatedTelemetry: boolean;
}

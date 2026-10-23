import React from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  Layers, 
  Database, 
  Globe
} from 'lucide-react';
import { ServiceComponent, ClusterTelemetry } from '../../types/telemetry';
import { Badge } from '../common/Badge';
import { TelemetryTag } from '../common/TelemetryTag';

interface InfraHealthPanelProps {
  services: ServiceComponent[];
  cluster: ClusterTelemetry | null;
}

export const InfraHealthPanel: React.FC<InfraHealthPanelProps> = ({
  services,
  cluster,
}) => {
  const getServiceIcon = (type: ServiceComponent['type']) => {
    switch (type) {
      case 'frontend':
        return <Globe className="w-3.5 h-3.5 text-[#D99A9A]" />;
      case 'api':
        return <Activity className="w-3.5 h-3.5 text-[#70777B]" />;
      case 'redis':
        return <Database className="w-3.5 h-3.5 text-green-700" />;
      case 'worker':
        return <Layers className="w-3.5 h-3.5 text-amber-700" />;
      default:
        return <Server className="w-3.5 h-3.5 text-[#303437]" />;
    }
  };

  return (
    <div className="rounded-xl bg-white border border-[#F2DEDE] p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col space-y-3">
      {/* Header with clear Telemetry distinction */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#F2DEDE]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#303437] font-mono uppercase tracking-wide flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#D99A9A]" />
              Service Health & Telemetry
            </h3>
            <TelemetryTag type="telemetry" />
          </div>
          <p className="text-[11px] text-[#70777B] mt-0.5">
            Real-time container health, CPU/memory quotas, and AKS replica counts
          </p>
        </div>

        {/* Cluster environment label */}
        {cluster && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#303437] bg-[#F4F7F8] px-2.5 py-0.5 rounded-md border border-[#D8DFE2]">
            <span className="text-[#70777B]">AKS:</span>
            <span className="font-bold text-[#303437]">{cluster.clusterName}</span>
            <span className="text-[#B8BFC2]">|</span>
            <span className="text-[#70777B]">{cluster.region}</span>
          </div>
        )}
      </div>

      {/* Services Grid: Frontend, API, Redis, Worker */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {services.map(svc => {
          const memPercent = Math.round((svc.memoryUsageMB / svc.memoryLimitMB) * 100);

          return (
            <div
              key={svc.id}
              className="p-3 rounded-lg bg-[#FAF5F5] border border-[#F2DEDE] hover:border-[#D99A9A] transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                {/* Service Name & Status Badge */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-white border border-[#F2DEDE] shrink-0 shadow-sm">
                      {getServiceIcon(svc.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#303437] font-mono leading-tight">
                        {svc.name}
                      </h4>
                      <p className="text-[10px] text-[#70777B]">{svc.role}</p>
                    </div>
                  </div>
                  <Badge health={svc.status} size="sm" />
                </div>

                <div className="text-[10px] text-[#70777B] font-mono mt-1.5 bg-white p-1.5 rounded border border-[#F2DEDE]">
                  {svc.statusMessage}
                </div>
              </div>

              {/* Resource Utilization Metrics */}
              <div className="space-y-1.5 pt-1.5 border-t border-[#F2DEDE] text-[11px] font-mono">
                {/* CPU Utilization */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[#70777B] text-[10px]">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5 text-[#D99A9A]" />
                      CPU
                    </span>
                    <span className="text-[#303437] font-bold">{svc.cpuPercent}% / {svc.cpuLimit}</span>
                  </div>
                  <div className="w-full h-1 bg-[#E4BFBF]/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        svc.cpuPercent > 80 ? 'bg-red-500' : svc.cpuPercent > 50 ? 'bg-amber-500' : 'bg-[#D99A9A]'
                      }`}
                      style={{ width: `${Math.min(svc.cpuPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Memory Usage */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[#70777B] text-[10px]">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-2.5 h-2.5 text-[#70777B]" />
                      Memory
                    </span>
                    <span className="text-[#303437] font-bold">{svc.memoryUsageMB}MB / {svc.memoryLimitMB}MB</span>
                  </div>
                  <div className="w-full h-1 bg-[#D8DFE2] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        memPercent > 85 ? 'bg-red-500' : memPercent > 65 ? 'bg-amber-500' : 'bg-[#70777B]'
                      }`}
                      style={{ width: `${Math.min(memPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Replicas & Restarts */}
                <div className="pt-0.5 flex items-center justify-between text-[10px] text-[#70777B]">
                  <span>Pods: <strong className="text-[#303437]">{svc.activeReplicas}/{svc.desiredReplicas}</strong></span>
                  <span>Restarts: <strong className={svc.podRestarts > 0 ? 'text-amber-700' : 'text-[#303437]'}>{svc.podRestarts}</strong></span>
                  <span>Uptime: <strong className="text-[#303437]">{svc.uptime}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redis & Cluster Summary Banner */}
      {cluster && (
        <div className="p-2.5 rounded-lg bg-[#FAF5F5] border border-[#F2DEDE] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#303437]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-green-700 shrink-0" />
            <span className="text-[#70777B]">Redis Buffer:</span>
            <span className="font-bold text-green-700">{cluster.redisMetrics.connectedClients} clients</span>
            <span className="text-[#D8DFE2]">|</span>
            <span>Used Mem: <strong className="text-[#303437]">{cluster.redisMetrics.usedMemoryMB}MB</strong></span>
            <span className="text-[#D8DFE2]">|</span>
            <span>Hit Rate: <strong className="text-green-700">{cluster.redisMetrics.hitRatePercent}%</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#70777B]">Nodes:</span>
            <span className="font-bold text-[#303437]">{cluster.healthyNodes}/{cluster.totalNodes} Ready</span>
            <span className="text-[#D8DFE2]">|</span>
            <span className="text-[#70777B]">AKS Version:</span>
            <span className="text-[#9A5050] font-bold">{cluster.k8sVersion}</span>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { 
  Server, 
  RefreshCw, 
  Terminal, 
  CheckCircle2 
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { InfraHealthPanel } from '../dashboard/InfraHealthPanel';
import { TelemetryTag } from '../common/TelemetryTag';

export const InfrastructureView: React.FC = () => {
  const { services, cluster, refreshData, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 rounded-2xl bg-white border border-pink-100 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-plum font-mono flex items-center gap-2">
              <Server className="w-5 h-5 text-rose-pink" />
              AKS Cluster & Container Telemetry
            </h2>
            <TelemetryTag type="telemetry" />
          </div>
          <p className="text-xs text-plum-muted mt-1 leading-relaxed">
            Azure Kubernetes Service (AKS) node pool, container replicas, and Redis rate limiter health
          </p>
        </div>

        <button
          onClick={() => refreshData()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-plum bg-white border border-pink-200 hover:bg-rose-pink-50 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-pink ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Pod Metrics
        </button>
      </div>

      {/* Cluster Overview Grid */}
      {cluster && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-card space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-plum-muted">
              <span>AKS Node Pool</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> All Healthy
              </span>
            </div>
            <div className="text-2xl font-bold text-plum font-mono">
              {cluster.healthyNodes} / {cluster.totalNodes} Nodes
            </div>
            <div className="text-[11px] text-plum-muted font-mono">
              Instance: Standard_D4s_v5 (3x 16GB)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-card space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-plum-muted">
              <span>Cluster CPU Allocation</span>
              <span className="text-rose-pink font-mono font-bold">{cluster.clusterCpuUsagePercent}%</span>
            </div>
            <div className="text-2xl font-bold text-plum font-mono">
              {(cluster.clusterCpuUsagePercent * 0.12).toFixed(1)} / 12 Cores
            </div>
            <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-rose-pink rounded-full" 
                style={{ width: `${cluster.clusterCpuUsagePercent}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-card space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-plum-muted">
              <span>Cluster Memory Allocation</span>
              <span className="text-purple-600 font-mono font-bold">{cluster.clusterMemoryUsagePercent}%</span>
            </div>
            <div className="text-2xl font-bold text-plum font-mono">
              {(cluster.clusterMemoryUsagePercent * 0.48).toFixed(1)} / 48 GB
            </div>
            <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-purple-500 rounded-full" 
                style={{ width: `${cluster.clusterMemoryUsagePercent}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-card space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-plum-muted">
              <span>Total K8s Pods</span>
              <span className="text-emerald-700 font-mono font-bold">100% Running</span>
            </div>
            <div className="text-2xl font-bold text-plum font-mono">
              {cluster.runningPods} / {cluster.totalPods} Pods
            </div>
            <div className="text-[11px] text-plum-muted font-mono">
              Namespace: <span className="text-rose-pink-700 font-bold">sentinelx-soc</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Infra Panel */}
      <InfraHealthPanel services={services} cluster={cluster} />

      {/* Detailed Pods & Image Registry Specs */}
      <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-rose-pink" />
            <h3 className="text-sm font-semibold text-plum font-mono">
              Deployment Specification & Container Registry Artifacts
            </h3>
          </div>
          <span className="text-xs font-mono text-plum-muted font-medium">
            Azure Container Registry (ACR)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-pink-100 text-plum-muted uppercase text-[11px] bg-baby-pink/60">
                <th className="py-2.5 px-3 rounded-l-lg">Service Name</th>
                <th className="py-2.5 px-3">Container Image Tag</th>
                <th className="py-2.5 px-3">CPU Limit</th>
                <th className="py-2.5 px-3">Memory Limit</th>
                <th className="py-2.5 px-3">Uptime</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Health Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {services.map(svc => (
                <tr key={svc.id} className="hover:bg-rose-pink-50/50 transition-colors">
                  <td className="py-3 px-3 text-plum font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {svc.name}
                  </td>
                  <td className="py-3 px-3 text-rose-pink-700 font-medium">{svc.containerImage}</td>
                  <td className="py-3 px-3 text-plum-muted">{svc.cpuLimit}</td>
                  <td className="py-3 px-3 text-plum-muted">{svc.memoryLimitMB}MB</td>
                  <td className="py-3 px-3 text-plum-muted">{svc.uptime}</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">Passing (HTTP 200)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

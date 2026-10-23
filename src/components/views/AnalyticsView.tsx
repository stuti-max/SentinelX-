import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { 
  BarChart3, 
  Globe, 
  Target,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../../services/api';
import { AttackVectorPoint, TargetedEndpointPoint, GeoDistributionPoint } from '../../types/dashboard';
import { TelemetryTag } from '../common/TelemetryTag';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AnalyticsView: React.FC = () => {
  const [attackVectors, setAttackVectors] = useState<AttackVectorPoint[]>([]);
  const [targetedEndpoints, setTargetedEndpoints] = useState<TargetedEndpointPoint[]>([]);
  const [geoData, setGeoData] = useState<GeoDistributionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiService.getAnalyticsData().then(data => {
      setAttackVectors(data.attackVectors);
      setTargetedEndpoints(data.targetedEndpoints);
      setGeoData(data.geoDistribution);
      setIsLoading(false);
    });
  }, []);

  const vectorColors = ['#E11D48', '#EA580C', '#D97706', '#E879B9', '#8C4B76'];

  if (isLoading) {
    return <LoadingSpinner message="Calculating Threat Analytics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 rounded-2xl bg-white border border-pink-100 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-plum font-mono flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rose-pink" />
              Security Analytics & Threat Vectors
            </h2>
            <TelemetryTag type="simulated" />
          </div>
          <p className="text-xs text-plum-muted mt-1 leading-relaxed">
            Aggregated attack taxonomy, targeted endpoints breakdown, and simulated geo-origin analytics
          </p>
        </div>

        {/* Security Posture Index */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-baby-pink border border-pink-100 shrink-0 shadow-sm">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center font-mono font-bold text-emerald-700 text-sm shadow-sm">
            88
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-plum-muted font-semibold">Security Posture Score</div>
            <div className="text-xs font-bold text-emerald-700">LOW THREAT RESIDUAL</div>
          </div>
        </div>
      </div>

      {/* Row 1: Attack Category Taxonomy Chart & Top Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Vectors Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-pink-100/90 shadow-card hover:shadow-card-hover transition-all flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-plum font-mono">
                Top Attack Categories Breakdown
              </h3>
              <p className="text-xs text-plum-muted mt-0.5">
                Proportion of simulated probe types intercepted by SentinelX rules
              </p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={attackVectors}
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#FCE7F3" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#835372" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono, monospace" 
                />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  stroke="#6B3157" 
                  fontSize={11} 
                  width={150}
                  tickLine={false}
                  fontFamily="JetBrains Mono, monospace"
                  tickFormatter={val => val.length > 20 ? `${val.substring(0, 20)}...` : val}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as AttackVectorPoint;
                      return (
                        <div className="rounded-xl bg-white border border-pink-200 p-2.5 shadow-lg text-xs font-mono">
                          <div className="font-bold text-plum">{d.category}</div>
                          <div className="text-plum-muted mt-1 font-medium">
                            {d.count} intercepted probes ({d.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {attackVectors.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={vectorColors[index % vectorColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Targeted API Endpoints */}
        <div className="p-6 rounded-2xl bg-white border border-pink-100/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-pink" />
                <h3 className="text-sm font-semibold text-plum font-mono">
                  Top 5 Targeted API Endpoints
                </h3>
              </div>
              <span className="text-xs font-mono text-plum-muted font-semibold">Total Probes</span>
            </div>
            <p className="text-xs text-plum-muted mb-4">
              Endpoints subjected to the highest frequency of simulated probing
            </p>

            <div className="space-y-3 font-mono text-xs">
              {targetedEndpoints.map((item, idx) => {
                const blockPercent = Math.round((item.blocked / item.attempts) * 100);
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-baby-pink/60 border border-pink-100 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge method={item.method} size="sm" />
                        <span className="font-semibold text-plum">{item.endpoint}</span>
                      </div>
                      <span className="font-bold text-plum">{item.attempts} hits</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-plum-muted">
                      <span>Mitigated / Blocked at WAF: <strong className="text-emerald-700 font-bold">{item.blocked} ({blockPercent}%)</strong></span>
                      <span>Last Probe: {item.lastAttempt}</span>
                    </div>

                    <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-pink rounded-full" 
                        style={{ width: `${Math.min(blockPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Simulated Geo Distribution & Attack Origin Analytics */}
      <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-pink" />
            <h3 className="text-sm font-semibold text-plum font-mono">
              Simulated Geolocation Threat Origin
            </h3>
            <TelemetryTag type="simulated" />
          </div>
          <span className="text-xs text-plum-muted font-mono font-medium">
            IP to Geo City Resolution
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {geoData.map((geo, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-baby-pink border border-pink-100 space-y-1 font-mono shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-plum">{geo.country}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-plum-muted border border-pink-200 font-bold shadow-sm">
                  {geo.code}
                </span>
              </div>
              <div className="text-xl font-bold text-plum mt-1">
                {geo.events} <span className="text-xs font-normal text-plum-muted">probes</span>
              </div>
              <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{geo.criticalCount} Critical</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

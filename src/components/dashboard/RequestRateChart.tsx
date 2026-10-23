import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RequestRatePoint } from '../../types/dashboard';
import { TelemetryTag } from '../common/TelemetryTag';

interface RequestRateChartProps {
  data: RequestRatePoint[];
}

export const RequestRateChart: React.FC<RequestRateChartProps> = ({ data }) => {
  return (
    <div className="rounded-xl bg-white border border-[#F2DEDE] p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col h-[300px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#303437] font-mono uppercase tracking-wide">
              HTTP Requests Per Minute
            </h3>
            <TelemetryTag type="telemetry" />
          </div>
          <p className="text-[11px] text-[#70777B] mt-0.5">
            Ingestion throughput handled by API Gateway pods
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-[#D99A9A] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#D99A9A]"></span>
            Throughput (RPM)
          </span>
        </div>
      </div>

      {/* Chart Canvas: Simple rose-pink bar chart */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4E6E6" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#70777B" 
              fontSize={10} 
              tickLine={false}
              axisLine={{ stroke: '#F2DEDE' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis 
              stroke="#70777B" 
              fontSize={10} 
              tickLine={false}
              axisLine={{ stroke: '#F2DEDE' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0].payload as RequestRatePoint;
                  return (
                    <div className="rounded-lg bg-white border border-[#D99A9A] p-2.5 shadow-lg text-xs font-mono">
                      <div className="text-[#70777B] mb-1 border-b border-[#F2DEDE] pb-1">
                        Time: {label}
                      </div>
                      <div className="text-[#9A5050] font-bold text-sm">
                        {entry.rpm.toLocaleString()} RPM
                      </div>
                      <div className="text-[#70777B] mt-1 text-[11px] flex justify-between gap-3">
                        <span>Success Rate:</span>
                        <span className="text-green-700 font-bold">{entry.successRate}%</span>
                      </div>
                      <div className="text-[#70777B] text-[11px] flex justify-between gap-3">
                        <span>Blocked at Edge:</span>
                        <span className="text-red-700 font-bold">{entry.blockedRate}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="rpm" 
              fill="#D99A9A" 
              radius={[4, 4, 0, 0]} 
              opacity={0.9}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

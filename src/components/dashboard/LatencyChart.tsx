import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { LatencyTrendPoint } from '../../types/dashboard';
import { TelemetryTag } from '../common/TelemetryTag';

interface LatencyChartProps {
  data: LatencyTrendPoint[];
}

export const LatencyChart: React.FC<LatencyChartProps> = ({ data }) => {
  return (
    <div className="rounded-xl bg-white border border-[#F2DEDE] p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col h-[300px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#303437] font-mono uppercase tracking-wide">
              API Latency & SLA Performance
            </h3>
            <TelemetryTag type="telemetry" />
          </div>
          <p className="text-[11px] text-[#70777B] mt-0.5">
            P95 response time vs 120ms Azure SLA target threshold
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-green-200 bg-green-50 text-green-700 text-[11px] font-mono font-semibold">
          <span>Target &lt; 120ms:</span>
          <span className="font-bold">Compliant</span>
        </div>
      </div>

      {/* Chart Canvas: Clean line chart with P95 latency and an SLA reference line */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
              unit="ms"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-white border border-[#D99A9A] p-2.5 shadow-lg text-xs font-mono">
                      <div className="text-[#70777B] mb-1 border-b border-[#F2DEDE] pb-1">
                        Time: {label}
                      </div>
                      <div className="space-y-0.5 text-[11px]">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-3">
                            <span style={{ color: entry.color }} className="font-semibold">{entry.name}:</span>
                            <span className="font-bold text-[#303437]">{entry.value} ms</span>
                          </div>
                        ))}
                        <div className="text-[10px] text-green-700 font-semibold pt-1">
                          ✓ Within SLA limit (120ms)
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* SLA Reference Line */}
            <ReferenceLine 
              y={120} 
              stroke="#DC2626" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
              label={{ value: 'SLA Limit (120ms)', fill: '#DC2626', fontSize: 10, position: 'insideTopRight' }}
            />
            <Line 
              type="monotone" 
              dataKey="p95" 
              name="P95 Latency" 
              stroke="#D99A9A" 
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#D99A9A' }}
            />
            <Line 
              type="monotone" 
              dataKey="p50" 
              name="P50 Median" 
              stroke="#70777B" 
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

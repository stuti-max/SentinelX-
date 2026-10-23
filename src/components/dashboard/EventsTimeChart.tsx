import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SecurityEventsTimePoint } from '../../types/dashboard';
import { TelemetryTag } from '../common/TelemetryTag';

interface EventsTimeChartProps {
  data: SecurityEventsTimePoint[];
}

export const EventsTimeChart: React.FC<EventsTimeChartProps> = ({ data }) => {
  return (
    <div className="rounded-xl bg-white border border-[#F2DEDE] p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col h-[300px]">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#303437] font-mono uppercase tracking-wide">
              Security Events Over Time
            </h3>
            <TelemetryTag type="simulated" />
          </div>
          <p className="text-[11px] text-[#70777B] mt-0.5">
            24-hour total simulated incident volume stream
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#70777B] bg-[#FDF7F7] px-2 py-0.5 rounded border border-[#F2DEDE]">
          <span>Window:</span>
          <span className="text-[#303437] font-bold">Last 24 Hours</span>
        </div>
      </div>

      {/* Chart Canvas: Soft rose-pink area chart */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="rosePinkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D99A9A" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#F2DEDE" stopOpacity={0.05}/>
              </linearGradient>
            </defs>

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
                  const item = payload[0].payload as SecurityEventsTimePoint;
                  return (
                    <div className="rounded-lg bg-white border border-[#D99A9A] p-2.5 shadow-lg text-xs font-mono">
                      <div className="text-[#70777B] font-semibold mb-1 pb-1 border-b border-[#F2DEDE]">
                        Time: {label}
                      </div>
                      <div className="text-[#9A5050] font-bold text-sm">
                        {item.total} Total Security Events
                      </div>
                      <div className="mt-1.5 space-y-0.5 text-[10px] text-[#70777B]">
                        <div className="flex justify-between gap-3">
                          <span className="text-red-600 font-semibold">• Critical:</span>
                          <span className="font-bold text-[#303437]">{item.critical}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-orange-600 font-semibold">• High:</span>
                          <span className="font-bold text-[#303437]">{item.high}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-amber-600 font-semibold">• Medium:</span>
                          <span className="font-bold text-[#303437]">{item.medium}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-[#D99A9A] font-semibold">• Low:</span>
                          <span className="font-bold text-[#303437]">{item.low}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              name="Security Events" 
              stroke="#D99A9A" 
              fillOpacity={1} 
              fill="url(#rosePinkGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

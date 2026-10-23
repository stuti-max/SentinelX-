import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SeverityDistributionPoint } from '../../types/dashboard';
import { TelemetryTag } from '../common/TelemetryTag';

interface SeverityDonutProps {
  data: SeverityDistributionPoint[];
}

export const SeverityDonut: React.FC<SeverityDonutProps> = ({ data }) => {
  const totalEvents = data.reduce((acc, curr) => acc + curr.value, 0);

  // Restrained pastel colors
  const getSliceColor = (name: string, fallback: string) => {
    switch (name.toLowerCase()) {
      case 'critical':
        return '#E05D5D';
      case 'high':
        return '#E58A55';
      case 'medium':
        return '#E5B655';
      case 'low':
        return '#D99A9A';
      case 'info':
        return '#A8A3A3';
      default:
        return fallback;
    }
  };

  return (
    <div className="rounded-xl bg-white border border-[#F2DEDE] p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#303437] font-mono uppercase tracking-wide">
              Severity Distribution
            </h3>
            <TelemetryTag type="simulated" />
          </div>
          <p className="text-[11px] text-[#70777B] mt-0.5">
            Active threat categorization
          </p>
        </div>
      </div>

      {/* Donut and Legend Layout */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 min-h-0">
        {/* Pie graphic with centered text */}
        <div className="relative w-full sm:w-1/2 h-[175px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getSliceColor(entry.name, entry.color)} 
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as SeverityDistributionPoint;
                    const sliceColor = getSliceColor(item.name, item.color);
                    return (
                      <div className="rounded-lg bg-white border border-[#F2DEDE] p-2 shadow-lg text-xs font-mono">
                        <div className="flex items-center gap-1.5" style={{ color: sliceColor }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sliceColor }}></span>
                          <span className="font-bold">{item.name}</span>
                        </div>
                        <div className="text-[#303437] font-bold mt-0.5">
                          {item.value.toLocaleString()} ({item.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono uppercase text-[#70777B] font-semibold">Total</span>
            <span className="text-lg font-bold font-mono text-[#303437]">
              {totalEvents.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend list */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center space-y-1.5 text-xs font-mono">
          {data.map((item, idx) => {
            const sliceColor = getSliceColor(item.name, item.color);
            return (
              <div key={idx} className="flex items-center justify-between py-0.5 border-b border-[#F7EBEB] last:border-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sliceColor }}></span>
                  <span className="text-[#303437] font-medium text-[11px]">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#303437] text-[11px]">{item.value}</span>
                  <span className="text-[#8E969B] text-[10px] w-10 text-right">({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

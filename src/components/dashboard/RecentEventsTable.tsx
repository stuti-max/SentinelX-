import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Clock, 
  Download
} from 'lucide-react';
import { SecurityEvent, Severity, EventStatus } from '../../types/security';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { TelemetryTag } from '../common/TelemetryTag';

interface RecentEventsTableProps {
  events: SecurityEvent[];
  onSelectEvent: (event: SecurityEvent) => void;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  pageSize?: number;
}

export const RecentEventsTable: React.FC<RecentEventsTableProps> = ({
  events,
  onSelectEvent,
  title = 'Recent Security Events',
  subtitle = 'Real-time simulated incident log with source attribution and triage status',
  showFilters = true,
  pageSize = 6,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch =
        searchQuery === '' ||
        event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sourceIp.includes(searchQuery) ||
        event.targetEndpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sourceLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || event.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [events, searchQuery, severityFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinelx-security-events-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  return (
    <div className="rounded-xl bg-white border border-[#F2DEDE] p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-[#F2DEDE]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#303437] font-mono uppercase tracking-wide">
              {title}
            </h3>
            <TelemetryTag type="simulated" />
          </div>
          <p className="text-[11px] text-[#70777B] mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Filter and Search Bar */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-[#70777B] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search IP, endpoint..."
                className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-[#F8FAFB] border border-[#D8DFE2] text-xs text-[#303437] placeholder-[#8E969B] focus:outline-none focus:border-[#D99A9A] font-mono transition-colors"
              />
            </div>

            {/* Severity Filter Dropdown */}
            <div className="flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#70777B] shrink-0" />
              <select
                value={severityFilter}
                onChange={e => {
                  setSeverityFilter(e.target.value as Severity | 'ALL');
                  setCurrentPage(1);
                }}
                className="py-1 px-2 rounded-lg bg-[#F8FAFB] border border-[#D8DFE2] text-xs text-[#303437] font-mono focus:outline-none focus:border-[#D99A9A]"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="INFORMATIONAL">Info</option>
              </select>
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as EventStatus | 'ALL');
                setCurrentPage(1);
              }}
              className="py-1 px-2 rounded-lg bg-[#F8FAFB] border border-[#D8DFE2] text-xs text-[#303437] font-mono focus:outline-none focus:border-[#D99A9A]"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="BLOCKED">Blocked</option>
            </select>

            {/* Export JSON button */}
            <button
              onClick={exportToJson}
              title="Export filtered events as JSON"
              className="p-1 rounded-lg border border-[#D8DFE2] bg-white text-[#70777B] hover:text-[#303437] hover:bg-[#F8FAFB] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Table Content */}
      {paginatedEvents.length === 0 ? (
        <EmptyState
          title="No Matching Events Found"
          description="No security events match the current filter or search criteria."
          onReset={handleResetFilters}
          actionText="Clear Filters"
        />
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F2DEDE] text-[#70777B] font-mono text-[10px] uppercase tracking-wider bg-[#FDF7F7]">
                <th className="py-2 px-2.5 font-semibold rounded-l-md">ID & Time</th>
                <th className="py-2 px-2.5 font-semibold">Incident Type</th>
                <th className="py-2 px-2.5 font-semibold">Severity</th>
                <th className="py-2 px-2.5 font-semibold">Source IP / Geo</th>
                <th className="py-2 px-2.5 font-semibold">Target Endpoint</th>
                <th className="py-2 px-2.5 font-semibold">Status</th>
                <th className="py-2 px-2.5 font-semibold text-right rounded-r-md">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7EBEB] font-sans">
              {paginatedEvents.map(event => (
                <tr
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="hover:bg-[#FDF7F7] transition-colors cursor-pointer group"
                >
                  {/* Timestamp & ID */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <div className="font-mono text-[#303437] font-semibold text-[11px]">
                      {event.id}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#70777B] font-mono mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-[#D99A9A]" />
                      <span>{formatRelativeTime(event.timestamp)}</span>
                    </div>
                  </td>

                  {/* Incident Type */}
                  <td className="py-2.5 px-2.5">
                    <div className="font-semibold text-[#303437] text-xs">
                      {event.eventType}
                    </div>
                    <div className="text-[10px] text-[#70777B] truncate max-w-[200px]" title={event.description}>
                      {event.mitreTechnique.id}: {event.mitreTechnique.name}
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <Badge severity={event.severity} size="sm" />
                  </td>

                  {/* Source IP / Geo */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <div className="font-mono text-[#303437] font-medium text-[11px]">
                      {event.sourceIp}
                    </div>
                    <div className="text-[10px] text-[#70777B]">
                      {event.sourceGeo.city}, {event.sourceGeo.countryCode}
                    </div>
                  </td>

                  {/* Target Endpoint */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono">
                      <Badge method={event.httpMethod} size="sm" />
                      <span className="text-[#303437] text-[11px] truncate max-w-[120px]" title={event.targetEndpoint}>
                        {event.targetEndpoint}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <Badge status={event.status} size="sm" />
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSelectEvent(event);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white border border-[#D8DFE2] text-[#303437] hover:bg-[#D99A9A] hover:text-white hover:border-[#D99A9A] transition-colors font-mono text-[10px] font-semibold"
                    >
                      <Eye className="w-2.5 h-2.5" />
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#F2DEDE] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#70777B] font-mono">
        <div>
          Showing {paginatedEvents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
          {Math.min(currentPage * pageSize, filteredEvents.length)} of {filteredEvents.length} events
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1 rounded border border-[#D8DFE2] bg-white text-[#303437] hover:bg-[#FDF7F7] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-semibold text-[#303437] px-1">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1 rounded border border-[#D8DFE2] bg-white text-[#303437] hover:bg-[#FDF7F7] disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  RefreshCw, 
  Clock, 
  Layers, 
  ShieldCheck,
  User,
  Radio,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { 
    activeTab,
    isLoading, 
    refreshData, 
    demoMode, 
    setDemoMode,
    autoRefresh,
    setAutoRefresh,
    notificationMessage,
    clearNotification
  } = useDashboard();

  const [currentTime, setCurrentTime] = useState<{ local: string; utc: string }>({
    local: '',
    utc: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime({
        local: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        utc: now.toISOString().substring(11, 19) + ' UTC',
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Security Overview';
      case 'events':
        return 'Security Events Log';
      case 'analytics':
        return 'Threat Analytics';
      case 'infrastructure':
        return 'Infrastructure Health';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Security Overview';
    }
  };

  return (
    <header className="h-14 border-b border-[#D8DFE2] bg-white sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-sm">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg text-[#70777B] hover:text-[#303437] hover:bg-[#E9EEF0] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title from reference: "Security Overview" */}
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm sm:text-base font-bold text-[#303437] font-mono tracking-tight">
            {getPageTitle()}
          </h1>
          
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[#F2DEDE] bg-[#FDF7F7] text-[11px] font-mono text-[#70777B]">
            <Layers className="w-3 h-3 text-[#D99A9A]" />
            <span>AKS East US</span>
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            title="Click to toggle between Demo Simulation and Live REST API"
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono font-medium transition-colors ${
              demoMode
                ? 'border-[#D99A9A] bg-[#FDF7F7] text-[#9A5050] hover:bg-[#F2DEDE]'
                : 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] hover:bg-[#DCFCE7]'
            }`}
          >
            <Radio className={`w-2.5 h-2.5 ${demoMode ? 'text-[#D99A9A]' : 'text-[#22C55E] animate-pulse'}`} />
            <span className="hidden sm:inline">{demoMode ? 'Demo Mode' : 'Live Mode'}</span>
            <span className="sm:hidden">{demoMode ? 'Demo' : 'Live'}</span>
          </button>
        </div>
      </div>

      {/* Center: Toast Notification if active */}
      {notificationMessage && (
        <div className="hidden xl:flex items-center gap-2 px-3 py-0.5 rounded-md border border-[#D99A9A] bg-[#FDF7F7] text-[#303437] text-xs font-mono shadow-sm">
          <CheckCircle2 className="w-3 h-3 text-[#D99A9A] shrink-0" />
          <span className="truncate max-w-xs">{notificationMessage}</span>
          <button 
            onClick={clearNotification}
            className="text-[#70777B] hover:text-[#303437] ml-1 text-xs"
          >
            ×
          </button>
        </div>
      )}

      {/* Right side: Clock, Refresh, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4F7F8] border border-[#D8DFE2] text-[11px] font-mono text-[#70777B]">
          <Clock className="w-3 h-3 text-[#D99A9A]" />
          <span>{currentTime.utc}</span>
        </div>

        {/* Auto Refresh Toggle */}
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          title={`Auto-refresh (10s) is ${autoRefresh ? 'ON' : 'PAUSED'}`}
          className={`p-1.5 rounded-md border transition-colors ${
            autoRefresh
              ? 'border-[#D99A9A] text-[#D99A9A] bg-[#FDF7F7]'
              : 'border-[#D8DFE2] text-[#8E969B] bg-white hover:bg-[#F4F7F8]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Manual Refresh */}
        <button
          onClick={() => refreshData()}
          disabled={isLoading}
          title="Manual refresh"
          className="p-1.5 rounded-md border border-[#D8DFE2] text-[#303437] bg-white hover:bg-[#F4F7F8] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D99A9A] ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#D8DFE2]">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-[#34383A] text-white flex items-center justify-center text-xs shadow-sm font-semibold">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#16A34A] border-2 border-white"></span>
          </div>

          <div className="hidden md:flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#303437] leading-tight">
                Analyst
              </span>
              <ShieldCheck className="w-3 h-3 text-[#D99A9A]" />
            </div>
            <span className="text-[10px] font-mono text-[#70777B] leading-tight">
              SOC Tier 2
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

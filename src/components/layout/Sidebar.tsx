import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  BarChart3, 
  Server, 
  Settings, 
  Zap, 
  Shield, 
  X,
  Radio
} from 'lucide-react';
import { NavigationTab } from '../../types/dashboard';
import { useDashboard } from '../../context/DashboardContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, kpis, simulateIncomingEvent, demoMode } = useDashboard();

  const navigationItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'events',
      label: 'Security Events',
      icon: <ShieldAlert className="w-4 h-4 shrink-0" />,
      badge: kpis?.criticalEvents.unmitigatedCount,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: <Server className="w-4 h-4 shrink-0" />,
      badge: kpis?.activeApiReplicas.active,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  const handleNavClick = (id: NavigationTab) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#34383A]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container: fixed ~200px width on desktop, aligned with application container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col bg-[#34383A] text-white w-[200px] shrink-0 h-full border-r border-[#2B2F31] transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#3E4346] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#D99A9A]/20 border border-[#D99A9A]/40 text-[#D99A9A]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white font-mono">
              Sentinel<span className="text-[#D99A9A]">X</span>
            </span>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-[#B8BFC2] hover:text-white hover:bg-[#3E4346] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8A9397]">
            Console
          </div>

          {navigationItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#D99A9A] text-white font-semibold shadow-sm'
                    : 'text-[#B8BFC2] hover:text-white hover:bg-[#3E4346]/80'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#9DA6AA]'}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-white/30 text-white' : 'bg-[#484D50] text-[#E5DEDE]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Demo Injection Quick CTA */}
          <div className="pt-4 pb-1">
            <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8A9397]">
              Simulation
            </div>
            <button
              onClick={simulateIncomingEvent}
              title="Inject a simulated attack event into the stream"
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all border border-[#D99A9A]/40 bg-[#D99A9A]/15 text-[#F2DEDE] hover:bg-[#D99A9A]/30 active:scale-95 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#D99A9A] shrink-0" />
              <span>Simulate Probe</span>
            </button>
          </div>
        </nav>

        {/* Bottom Cluster Status */}
        <div className="p-2.5 border-t border-[#3E4346] shrink-0 bg-[#2C3032]">
          <div className="p-2 rounded-lg bg-[#34383A] border border-[#3E4346] text-[10px] font-mono space-y-1">
            <div className="flex items-center justify-between text-[#8A9397]">
              <span>AKS Cluster</span>
              <span className="text-[#4ADE80] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                Ready
              </span>
            </div>
            <div className="text-white font-semibold truncate">eastus-sentinelx</div>
            <div className="text-[#8A9397] flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-[#D99A9A]" />
              <span className="truncate">{demoMode ? 'Demo Sim' : 'Live REST'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

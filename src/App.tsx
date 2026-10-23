import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { EventDetailModal } from './components/layout/EventDetailModal';

// Views
import { OverviewView } from './components/views/OverviewView';
import { SecurityEventsView } from './components/views/SecurityEventsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { InfrastructureView } from './components/views/InfrastructureView';
import { SettingsView } from './components/views/SettingsView';

const DashboardContent: React.FC = () => {
  const { activeTab, selectedEvent, setSelectedEvent, updateEventStatus } = useDashboard();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'events':
        return <SecurityEventsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'infrastructure':
        return <InfrastructureView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    /* 1. Page background: pale blush-pink (#FBF0F0) with generous outer padding on desktop */
    <div className="min-h-screen w-full bg-[#FBF0F0] flex items-center justify-center p-0 sm:p-4 lg:p-6 xl:p-7">
      {/* Wide, rounded application container with fixed dark charcoal sidebar & cool-grey content */}
      <div className="w-full max-w-[1480px] h-screen sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] rounded-none sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-frame border border-[#E5D2D2] flex flex-row bg-[#E9EEF0]">
        {/* Fixed-width dark charcoal sidebar (~200px wide) */}
        <Sidebar
          isOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main dashboard content canvas on the right (#E9EEF0) */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-[#E9EEF0] overflow-hidden">
          {/* Header */}
          <Topbar onOpenMobileMenu={() => setIsMobileNavOpen(true)} />

          {/* Simulation notice banner */}
          <DisclaimerBanner />

          {/* Scrollable canvas */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">
            <div className="max-w-[1360px] mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>

      {/* Interactive Incident Inspector Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdateStatus={updateEventStatus}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default App;

import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Radio, 
  Check, 
  AlertCircle, 
  Terminal,
  RefreshCw,
  Info
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { apiService, ApiStatus } from '../../services/api';
import { TelemetryTag } from '../common/TelemetryTag';

export const SettingsView: React.FC = () => {
  const { demoMode, setDemoMode, autoRefresh, setAutoRefresh, apiStatus } = useDashboard();

  const [customApiUrl, setCustomApiUrl] = useState(apiService.getBaseUrl());
  const [testingStatus, setTestingStatus] = useState<ApiStatus | null>(apiStatus);
  const [isPinging, setIsPinging] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTestConnection = async () => {
    setIsPinging(true);
    apiService.setBaseUrl(customApiUrl);
    try {
      const res = await apiService.checkApiHealth();
      setTestingStatus(res);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-card">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-rose-pink" />
          <h2 className="text-xl font-bold text-plum font-mono">
            Platform Settings & API Integration
          </h2>
        </div>
        <p className="text-xs text-plum-muted mt-1 leading-relaxed">
          Configure backend connectivity, simulation parameters, telemetry polling rate, and view academic portfolio metadata
        </p>
      </div>

      {/* Backend API Configuration */}
      <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-rose-pink" />
            <h3 className="text-sm font-semibold text-plum font-mono">
              Backend REST API Gateway Configuration
            </h3>
          </div>
          <span className="text-[11px] font-mono text-plum-muted">
            Env: <code className="text-rose-pink font-semibold">VITE_API_BASE_URL</code>
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-plum font-semibold mb-1.5">
              API Base URL
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={customApiUrl}
                onChange={e => setCustomApiUrl(e.target.value)}
                placeholder="http://localhost:5000/api/v1"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-baby-pink border border-pink-200 text-xs font-mono text-plum focus:outline-none focus:border-rose-pink shadow-sm"
              />
              <button
                onClick={handleTestConnection}
                disabled={isPinging}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-white bg-rose-pink hover:bg-rose-pink-500 shadow-sm transition-colors disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                Test Connection
              </button>
            </div>
          </div>

          {/* Test Status Banner */}
          {testingStatus && (
            <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between gap-2 shadow-sm ${
              testingStatus.isLiveApiConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-baby-pink border-pink-200 text-plum'
            }`}>
              <div className="flex items-center gap-2">
                {testingStatus.isLiveApiConnected ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="font-medium">
                  {testingStatus.isLiveApiConnected
                    ? `Live Express API Connected (${testingStatus.latencyMs}ms latency)`
                    : `API endpoint unreachable at ${testingStatus.apiBaseUrl}. Running in safe simulated demo mode.`}
                </span>
              </div>
              <span className="text-[10px] text-plum-muted">Checked: {testingStatus.lastChecked}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              API base URL updated successfully.
            </div>
          )}
        </div>
      </div>

      {/* Simulation & Telemetry Preferences */}
      <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-plum font-mono">
              Simulation & Polling Controls
            </h3>
          </div>
          <TelemetryTag type="simulated" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demo Mode Toggle */}
          <div className="p-4 rounded-xl bg-baby-pink/60 border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-plum">
                Simulated Demo Telemetry
              </span>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                  demoMode ? 'bg-rose-pink' : 'bg-pink-200'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                    demoMode ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-plum-muted leading-relaxed">
              When enabled, the frontend renders labeled mock telemetry for standalone evaluation and portfolio demonstrations without requiring backend services to run.
            </p>
          </div>

          {/* Auto Refresh Toggle */}
          <div className="p-4 rounded-xl bg-baby-pink/60 border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-plum">
                Background Telemetry Polling (10s)
              </span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                  autoRefresh ? 'bg-rose-pink' : 'bg-pink-200'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                    autoRefresh ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-plum-muted leading-relaxed">
              Automatically requests updated KPI deltas, timeline points, and pod replica health every 10 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Project Metadata & Resume Portfolio Documentation */}
      <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-pink-100">
          <Terminal className="w-4 h-4 text-rose-pink" />
          <h3 className="text-sm font-semibold text-plum font-mono">
            Academic Project Architecture & Specification
          </h3>
        </div>

        <div className="space-y-3 text-xs text-plum">
          <div className="p-4 rounded-xl bg-rose-pink-50 border border-pink-200 text-plum flex items-start gap-3">
            <Info className="w-5 h-5 text-rose-pink shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold font-mono text-plum">Capstone Project & Portfolio Disclosure:</strong>
              <p className="text-[11px] text-plum-muted leading-relaxed">
                SentinelX is an educational cloud security operations testbed. It models attack telemetry (SQLi, brute force, rate limit anomalies, SSRF probes) to demonstrate real-time SOC incident triage, Redis rate limiting, and Kubernetes microservice monitoring. It does not perform actual network intrusion detection.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px]">
            <div className="p-3.5 rounded-xl bg-baby-pink border border-pink-100 shadow-sm">
              <span className="text-plum-muted uppercase block font-semibold">Frontend Stack</span>
              <span className="text-plum font-bold">React 18 + Vite + TS</span>
              <span className="text-plum-muted block mt-0.5">Tailwind CSS + Recharts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-baby-pink border border-pink-100 shadow-sm">
              <span className="text-plum-muted uppercase block font-semibold">Backend Target</span>
              <span className="text-plum font-bold">Node.js + Express</span>
              <span className="text-plum-muted block mt-0.5">REST API / Ingestion</span>
            </div>
            <div className="p-3.5 rounded-xl bg-baby-pink border border-pink-100 shadow-sm">
              <span className="text-plum-muted uppercase block font-semibold">Cache & Buffer</span>
              <span className="text-plum font-bold">Redis In-Memory</span>
              <span className="text-plum-muted block mt-0.5">Token Bucket Rate Limiter</span>
            </div>
            <div className="p-3.5 rounded-xl bg-baby-pink border border-pink-100 shadow-sm">
              <span className="text-plum-muted uppercase block font-semibold">Deployment</span>
              <span className="text-plum font-bold">Docker + K8s (AKS)</span>
              <span className="text-plum-muted block mt-0.5">Azure Monitor Telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

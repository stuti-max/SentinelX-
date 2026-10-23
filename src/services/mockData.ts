import { SecurityEvent } from '../types/security';
import { ServiceComponent, ClusterTelemetry } from '../types/telemetry';
import { 
  DashboardKPIs, 
  SecurityEventsTimePoint, 
  SeverityDistributionPoint, 
  RequestRatePoint, 
  LatencyTrendPoint,
  AttackVectorPoint,
  TargetedEndpointPoint,
  GeoDistributionPoint
} from '../types/dashboard';

export const INITIAL_MOCK_EVENTS: SecurityEvent[] = [
  {
    id: 'SEC-89241',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    eventType: 'SQL Injection Probe',
    category: 'Injection Probe',
    severity: 'CRITICAL',
    sourceIp: '185.220.101.5',
    sourceGeo: { country: 'Germany', city: 'Frankfurt', countryCode: 'DE' },
    sourceLabel: '185.220.101.5 (Tor Exit Node)',
    targetEndpoint: '/api/v1/auth/login',
    httpMethod: 'POST',
    statusCode: 403,
    status: 'BLOCKED',
    description: 'Malicious payload in username parameter: UNION SELECT null, password_hash FROM sys_users--',
    mitreTechnique: {
      id: 'T1190',
      name: 'Exploit Public-Facing Application',
      tactic: 'Initial Access'
    },
    rawPayloadSample: '{"username": "admin\' UNION SELECT 1,2,password_hash FROM users--", "grant_type": "password"}',
    userAgent: 'sqlmap/1.7.2#stable (https://sqlmap.org)',
    ruleTriggered: 'WAF-RULE-942100: SQL Injection Defense Regex Matched',
    isSimulated: true
  },
  {
    id: 'SEC-89240',
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    eventType: 'Credential Stuffing Botnet',
    category: 'Authentication Abuse',
    severity: 'HIGH',
    sourceIp: '103.251.167.22',
    sourceGeo: { country: 'Vietnam', city: 'Hanoi', countryCode: 'VN' },
    sourceLabel: '103.251.167.22 (Residential Proxy)',
    targetEndpoint: '/api/v1/auth/token',
    httpMethod: 'POST',
    statusCode: 429,
    status: 'MITIGATED',
    description: '142 rapid sequential authentication attempts against distinct accounts within 45s.',
    mitreTechnique: {
      id: 'T1110.004',
      name: 'Credential Stuffing',
      tactic: 'Credential Access'
    },
    rawPayloadSample: '{"client_id": "web-spa", "credential_type": "user_pass", "attempt_seq": 88}',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
    ruleTriggered: 'REDIS-RATELIMIT-AUTH: Exceeded 10 failed auths/min per subnet',
    isSimulated: true
  },
  {
    id: 'SEC-89239',
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    eventType: 'SSRF Cloud Metadata Probe',
    category: 'Injection Probe',
    severity: 'CRITICAL',
    sourceIp: '45.154.255.89',
    sourceGeo: { country: 'Netherlands', city: 'Amsterdam', countryCode: 'NL' },
    sourceLabel: '45.154.255.89 (Hosted VPS)',
    targetEndpoint: '/api/v1/webhooks/verify',
    httpMethod: 'POST',
    statusCode: 400,
    status: 'INVESTIGATING',
    description: 'Outbound webhook target requested link-local Azure instance metadata endpoint (169.254.169.254).',
    mitreTechnique: {
      id: 'T1552.005',
      name: 'Cloud Instance Metadata API',
      tactic: 'Credential Access'
    },
    rawPayloadSample: '{"callback_url": "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01"}',
    userAgent: 'python-requests/2.31.0',
    ruleTriggered: 'SEC-EGRESS-FILTER: Azure IMDS Destination IP Blacklisted',
    isSimulated: true
  },
  {
    id: 'SEC-89238',
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    eventType: 'Path Traversal Attempt',
    category: 'Injection Probe',
    severity: 'HIGH',
    sourceIp: '194.26.29.112',
    sourceGeo: { country: 'Russia', city: 'Moscow', countryCode: 'RU' },
    sourceLabel: '194.26.29.112 (Known Threat Feed)',
    targetEndpoint: '/api/v1/export/report',
    httpMethod: 'GET',
    statusCode: 400,
    status: 'BLOCKED',
    description: 'Path normalization attack detected: ..%2F..%2F..%2Fetc%2Fshadow attempt.',
    mitreTechnique: {
      id: 'T1083',
      name: 'File and Directory Discovery',
      tactic: 'Discovery'
    },
    rawPayloadSample: 'GET /api/v1/export/report?template=../../../../../../etc/passwd%00.html HTTP/1.1',
    userAgent: 'curl/7.88.1',
    ruleTriggered: 'WAF-RULE-930100: Path Traversal Dot-Dot-Slash Filter',
    isSimulated: true
  },
  {
    id: 'SEC-89237',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    eventType: 'JWT Signature Bypass Replay',
    category: 'Authentication Abuse',
    severity: 'MEDIUM',
    sourceIp: '91.240.118.230',
    sourceGeo: { country: 'Bulgaria', city: 'Sofia', countryCode: 'BG' },
    sourceLabel: '91.240.118.230 (Public Cloud IP)',
    targetEndpoint: '/api/v1/tenants/settings',
    httpMethod: 'PUT',
    statusCode: 401,
    status: 'MITIGATED',
    description: 'Provided Bearer token with alg: none header and unsigned payload claiming role: cluster-admin.',
    mitreTechnique: {
      id: 'T1550.001',
      name: 'Application Access Token',
      tactic: 'Defense Evasion'
    },
    rawPayloadSample: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMzA5OSIsInJvbGUiOiJjbHVzdGVyLWFkbWluIn0.',
    userAgent: 'PostmanRuntime/7.36.1',
    ruleTriggered: 'AUTH-JWT-STRICT: Algorithm "none" rejected by verification middleware',
    isSimulated: true
  },
  {
    id: 'SEC-89236',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    eventType: 'API Rate Limit Spike',
    category: 'Rate Limit Violation',
    severity: 'MEDIUM',
    sourceIp: '54.210.82.14',
    sourceGeo: { country: 'United States', city: 'Ashburn', countryCode: 'US' },
    sourceLabel: '54.210.82.14 (AWS US-East-1)',
    targetEndpoint: '/api/v1/metrics/events',
    httpMethod: 'GET',
    statusCode: 429,
    status: 'MITIGATED',
    description: 'Client exceeded token-bucket quota with 620 requests within 60 seconds.',
    mitreTechnique: {
      id: 'T1499.002',
      name: 'Service Exhaustion Flood',
      tactic: 'Impact'
    },
    rawPayloadSample: 'GET /api/v1/metrics/events?limit=5000&format=json HTTP/1.1',
    userAgent: 'Go-http-client/1.1',
    ruleTriggered: 'REDIS-SLIDING-WINDOW: Rate limit 120 req/min exceeded',
    isSimulated: true
  },
  {
    id: 'SEC-89235',
    timestamp: new Date(Date.now() - 1000 * 60 * 62).toISOString(),
    eventType: 'Reconnaissance Port Scan Sweep',
    category: 'Reconnaissance',
    severity: 'LOW',
    sourceIp: '198.51.100.99',
    sourceGeo: { country: 'United Kingdom', city: 'London', countryCode: 'GB' },
    sourceLabel: '198.51.100.99 (Research Scanner)',
    targetEndpoint: '/.env',
    httpMethod: 'GET',
    statusCode: 404,
    status: 'OPEN',
    description: 'Automated crawler scanning for exposed environment configuration files and git repositories.',
    mitreTechnique: {
      id: 'T1595.002',
      name: 'Vulnerability Scanning',
      tactic: 'Reconnaissance'
    },
    rawPayloadSample: 'GET /.env, /.git/config, /actuator/health, /wp-login.php',
    userAgent: 'CensysInspect/1.1 (+https://about.censys.io/)',
    ruleTriggered: 'INGRESS-CANARY: Sensitive file path probing logged',
    isSimulated: true
  },
  {
    id: 'SEC-89234',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    eventType: 'Privilege Escalation Probe',
    category: 'Privilege Escalation',
    severity: 'HIGH',
    sourceIp: '195.123.210.4',
    sourceGeo: { country: 'Poland', city: 'Warsaw', countryCode: 'PL' },
    sourceLabel: '195.123.210.4 (Commercial VPN)',
    targetEndpoint: '/api/v1/rbac/roles/assign',
    httpMethod: 'POST',
    statusCode: 403,
    status: 'INVESTIGATING',
    description: 'Authenticated standard user attempted to assign system:masters role to their own user ID.',
    mitreTechnique: {
      id: 'T1078.004',
      name: 'Cloud Accounts Privilege Escalation',
      tactic: 'Privilege Escalation'
    },
    rawPayloadSample: '{"target_user": "usr_9981", "assigned_role": "system:masters", "scope": "cluster"}',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    ruleTriggered: 'RBAC-AUTHZ-VIOLATION: Missing "rbac.authorization.k8s.io/manage" permission',
    isSimulated: true
  },
  {
    id: 'SEC-89233',
    timestamp: new Date(Date.now() - 1000 * 60 * 92).toISOString(),
    eventType: 'GraphQL Query Depth Bomb',
    category: 'Anomaly Detection',
    severity: 'MEDIUM',
    sourceIp: '116.203.14.77',
    sourceGeo: { country: 'Germany', city: 'Nuremberg', countryCode: 'DE' },
    sourceLabel: '116.203.14.77 (Hetzner Online)',
    targetEndpoint: '/api/v1/graphql',
    httpMethod: 'POST',
    statusCode: 400,
    status: 'BLOCKED',
    description: 'Cyclic nested schema query exceeding maximum complexity limit of 10 levels.',
    mitreTechnique: {
      id: 'T1499.004',
      name: 'Application Exhaustion',
      tactic: 'Impact'
    },
    rawPayloadSample: 'query { me { friends { friends { friends { friends { friends { id } } } } } } }',
    userAgent: 'insomnia/8.6.0',
    ruleTriggered: 'GQL-DEPTH-LIMIT: Exceeded max ast-depth threshold of 6',
    isSimulated: true
  },
  {
    id: 'SEC-89232',
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    eventType: 'Malformed Geo-IP Ingestion Header',
    category: 'Anomaly Detection',
    severity: 'INFORMATIONAL',
    sourceIp: '142.250.190.46',
    sourceGeo: { country: 'United States', city: 'Mountain View', countryCode: 'US' },
    sourceLabel: '142.250.190.46 (Edge CDN)',
    targetEndpoint: '/api/v1/health',
    httpMethod: 'GET',
    statusCode: 200,
    status: 'MITIGATED',
    description: 'Header X-Forwarded-For contains invalid format or unresolvable internal IP.',
    mitreTechnique: {
      id: 'T1071.001',
      name: 'Web Protocols Header Smuggling',
      tactic: 'Command and Control'
    },
    rawPayloadSample: 'X-Forwarded-For: 127.0.0.1, 10.0.0.1, unknown',
    userAgent: 'EdgeHealthCheck/2.4',
    ruleTriggered: 'INGRESS-HEADER-SANITY: Spoofed proxy header replaced by gateway',
    isSimulated: true
  }
];

export const MOCK_KPIS: DashboardKPIs = {
  totalEvents: {
    value: 14820,
    deltaPercent: 12.4,
    trend: 'up',
    subtext: '+1,634 events vs previous 24h window'
  },
  criticalEvents: {
    value: 38,
    deltaPercent: -18.2,
    unmitigatedCount: 4,
    trend: 'down',
    subtext: '4 require immediate analyst triage'
  },
  requestsPerMinute: {
    value: 4120,
    deltaPercent: 5.8,
    peakRpm: 5890,
    trend: 'up',
    subtext: 'Current cluster edge throughput'
  },
  p95LatencyMs: {
    value: 48,
    slaThresholdMs: 120,
    isWithinSla: true,
    deltaPercent: -6.1,
    trend: 'down',
    subtext: '72ms below 120ms Azure SLA target'
  },
  serviceAvailability: {
    valuePercent: 99.98,
    targetPercent: 99.95,
    isMeetingTarget: true,
    downtimeMinutes30d: 8.6,
    subtext: 'Trailing 30-day AKS uptime'
  },
  activeApiReplicas: {
    active: 4,
    desired: 4,
    hpaMin: 2,
    hpaMax: 8,
    isHealthy: true,
    subtext: 'Kubernetes HPA autoscaling healthy'
  }
};

export const MOCK_SECURITY_EVENTS_TIMELINE: SecurityEventsTimePoint[] = [
  { time: '00:00', critical: 1, high: 4, medium: 12, low: 18, total: 35 },
  { time: '02:00', critical: 2, high: 3, medium: 9, low: 15, total: 29 },
  { time: '04:00', critical: 0, high: 2, medium: 7, low: 11, total: 20 },
  { time: '06:00', critical: 1, high: 5, medium: 14, low: 22, total: 42 },
  { time: '08:00', critical: 4, high: 9, medium: 28, low: 45, total: 86 },
  { time: '10:00', critical: 6, high: 14, medium: 42, low: 68, total: 130 },
  { time: '12:00', critical: 5, high: 16, medium: 48, low: 74, total: 143 },
  { time: '14:00', critical: 7, high: 19, medium: 52, low: 81, total: 159 },
  { time: '16:00', critical: 4, high: 13, medium: 39, low: 63, total: 119 },
  { time: '18:00', critical: 3, high: 11, medium: 34, low: 52, total: 100 },
  { time: '20:00', critical: 2, high: 8, medium: 25, low: 41, total: 76 },
  { time: '22:00', critical: 3, high: 6, medium: 18, low: 29, total: 56 }
];

export const MOCK_SEVERITY_DISTRIBUTION: SeverityDistributionPoint[] = [
  { name: 'Critical', value: 38, color: '#E11D48', percentage: 4.8 },
  { name: 'High', value: 162, color: '#EA580C', percentage: 20.4 },
  { name: 'Medium', value: 345, color: '#D97706', percentage: 43.4 },
  { name: 'Low', value: 215, color: '#E879B9', percentage: 27.1 },
  { name: 'Info', value: 34, color: '#8C4B76', percentage: 4.3 }
];

export const MOCK_REQUEST_RATES: RequestRatePoint[] = [
  { time: '00:00', rpm: 2100, successRate: 99.4, blockedRate: 0.6 },
  { time: '02:00', rpm: 1850, successRate: 99.6, blockedRate: 0.4 },
  { time: '04:00', rpm: 1620, successRate: 99.7, blockedRate: 0.3 },
  { time: '06:00', rpm: 2450, successRate: 99.1, blockedRate: 0.9 },
  { time: '08:00', rpm: 3890, successRate: 98.4, blockedRate: 1.6 },
  { time: '10:00', rpm: 4820, successRate: 97.8, blockedRate: 2.2 },
  { time: '12:00', rpm: 5120, successRate: 97.4, blockedRate: 2.6 },
  { time: '14:00', rpm: 4940, successRate: 97.9, blockedRate: 2.1 },
  { time: '16:00', rpm: 4310, successRate: 98.5, blockedRate: 1.5 },
  { time: '18:00', rpm: 3950, successRate: 98.8, blockedRate: 1.2 },
  { time: '20:00', rpm: 3420, successRate: 99.2, blockedRate: 0.8 },
  { time: '22:00', rpm: 2780, successRate: 99.3, blockedRate: 0.7 }
];

export const MOCK_LATENCY_TREND: LatencyTrendPoint[] = [
  { time: '00:00', p50: 18, p95: 42, p99: 88, slaLimit: 120 },
  { time: '02:00', p50: 17, p95: 39, p99: 82, slaLimit: 120 },
  { time: '04:00', p50: 16, p95: 38, p99: 79, slaLimit: 120 },
  { time: '06:00', p50: 19, p95: 44, p99: 92, slaLimit: 120 },
  { time: '08:00', p50: 24, p95: 56, p99: 112, slaLimit: 120 },
  { time: '10:00', p50: 28, p95: 64, p99: 128, slaLimit: 120 },
  { time: '12:00', p50: 26, p95: 61, p99: 122, slaLimit: 120 },
  { time: '14:00', p50: 25, p95: 58, p99: 118, slaLimit: 120 },
  { time: '16:00', p50: 22, p95: 51, p99: 104, slaLimit: 120 },
  { time: '18:00', p50: 21, p95: 49, p99: 98, slaLimit: 120 },
  { time: '20:00', p50: 19, p95: 45, p99: 91, slaLimit: 120 },
  { time: '22:00', p50: 18, p95: 43, p99: 86, slaLimit: 120 }
];

export const MOCK_SERVICES: ServiceComponent[] = [
  {
    id: 'svc-frontend',
    name: 'Frontend Web App',
    role: 'Vite / Nginx SPA Client',
    type: 'frontend',
    status: 'HEALTHY',
    statusMessage: 'Ready (2/2 endpoints receiving traffic)',
    cpuPercent: 14,
    cpuLimit: '500m',
    memoryUsageMB: 182,
    memoryLimitMB: 512,
    activeReplicas: 2,
    desiredReplicas: 2,
    podRestarts: 0,
    uptime: '14d 6h 22m',
    version: 'v1.4.0',
    containerImage: 'acr-sentinelx.azurecr.io/web:v1.4.0',
    lastHealthCheck: 'Just now'
  },
  {
    id: 'svc-api',
    name: 'API Gateway & Ingestion',
    role: 'Node.js / Express REST API',
    type: 'api',
    status: 'HEALTHY',
    statusMessage: 'Operational across 4 AKS pods',
    cpuPercent: 42,
    cpuLimit: '2000m',
    memoryUsageMB: 614,
    memoryLimitMB: 1536,
    activeReplicas: 4,
    desiredReplicas: 4,
    podRestarts: 0,
    uptime: '14d 6h 18m',
    version: 'v2.1.2',
    containerImage: 'acr-sentinelx.azurecr.io/api:v2.1.2',
    lastHealthCheck: 'Just now'
  },
  {
    id: 'svc-redis',
    name: 'Redis In-Memory Cache',
    role: 'Rate Limiter & Session Buffer',
    type: 'redis',
    status: 'HEALTHY',
    statusMessage: 'Primary-Replica Cluster in Sync',
    cpuPercent: 18,
    cpuLimit: '1000m',
    memoryUsageMB: 384,
    memoryLimitMB: 1024,
    activeReplicas: 3,
    desiredReplicas: 3,
    podRestarts: 0,
    uptime: '28d 11h 04m',
    version: 'v7.2.4',
    containerImage: 'redis:7.2-alpine',
    lastHealthCheck: 'Just now'
  },
  {
    id: 'svc-worker',
    name: 'Security Event Stream Worker',
    role: 'Anomaly Ingestion & Normalizer',
    type: 'worker',
    status: 'HEALTHY',
    statusMessage: 'Processing queue lag: 0.12s',
    cpuPercent: 31,
    cpuLimit: '1000m',
    memoryUsageMB: 428,
    memoryLimitMB: 1024,
    activeReplicas: 2,
    desiredReplicas: 2,
    podRestarts: 1,
    uptime: '9d 14h 50m',
    version: 'v1.8.0',
    containerImage: 'acr-sentinelx.azurecr.io/worker:v1.8.0',
    lastHealthCheck: 'Just now'
  }
];

export const MOCK_CLUSTER_TELEMETRY: ClusterTelemetry = {
  clusterName: 'aks-sentinelx-eastus2',
  region: 'East US 2',
  k8sVersion: 'v1.29.4 (Azure AKS)',
  nodePoolCount: 1,
  totalNodes: 3,
  healthyNodes: 3,
  totalPods: 18,
  runningPods: 18,
  clusterCpuUsagePercent: 28.5,
  clusterMemoryUsagePercent: 44.2,
  redisMetrics: {
    connectedClients: 84,
    usedMemoryMB: 384,
    peakMemoryMB: 512,
    hitRatePercent: 94.6,
    opsPerSecond: 1420,
    evictedKeys: 0
  },
  isSimulatedTelemetry: true
};

export const MOCK_ATTACK_VECTORS: AttackVectorPoint[] = [
  { category: 'Injection Probes (SQLi, XSS, SSRF)', count: 286, percentage: 36.0 },
  { category: 'Authentication Abuse & Stuffing', count: 214, percentage: 26.9 },
  { category: 'API Rate Limit & Volumetric', count: 168, percentage: 21.1 },
  { category: 'Reconnaissance & Scanners', count: 82, percentage: 10.3 },
  { category: 'Privilege Escalation Attempts', count: 45, percentage: 5.7 }
];

export const MOCK_TARGETED_ENDPOINTS: TargetedEndpointPoint[] = [
  { endpoint: '/api/v1/auth/login', method: 'POST', attempts: 542, blocked: 521, lastAttempt: '2m ago' },
  { endpoint: '/api/v1/webhooks/verify', method: 'POST', attempts: 318, blocked: 299, lastAttempt: '14m ago' },
  { endpoint: '/api/v1/export/report', method: 'GET', attempts: 186, blocked: 186, lastAttempt: '22m ago' },
  { endpoint: '/api/v1/graphql', method: 'POST', attempts: 142, blocked: 128, lastAttempt: '1h ago' },
  { endpoint: '/api/v1/users/export', method: 'GET', attempts: 94, blocked: 94, lastAttempt: '3h ago' }
];

export const MOCK_GEO_DISTRIBUTION: GeoDistributionPoint[] = [
  { country: 'Germany', code: 'DE', events: 194, criticalCount: 12 },
  { country: 'United States', code: 'US', events: 168, criticalCount: 6 },
  { country: 'Vietnam', code: 'VN', events: 142, criticalCount: 8 },
  { country: 'Netherlands', code: 'NL', events: 110, criticalCount: 7 },
  { country: 'Russia', code: 'RU', events: 88, criticalCount: 5 }
];

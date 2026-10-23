export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type EventStatus = 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'BLOCKED';

export type AttackCategory = 
  | 'Authentication Abuse'
  | 'Injection Probe'
  | 'Rate Limit Violation'
  | 'Anomaly Detection'
  | 'Reconnaissance'
  | 'Privilege Escalation'
  | 'Data Exfiltration Probe';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  category: AttackCategory;
  severity: Severity;
  sourceIp: string;
  sourceGeo: {
    country: string;
    city: string;
    countryCode: string;
  };
  sourceLabel: string;
  targetEndpoint: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  status: EventStatus;
  description: string;
  mitreTechnique: {
    id: string;
    name: string;
    tactic: string;
  };
  rawPayloadSample?: string;
  userAgent?: string;
  ruleTriggered: string;
  isSimulated: true; // Explicitly marks data as demonstration simulation
}

export interface EventFilterState {
  searchQuery: string;
  severity: Severity | 'ALL';
  status: EventStatus | 'ALL';
  category: string;
  timeRange: '1h' | '6h' | '24h' | '7d';
}

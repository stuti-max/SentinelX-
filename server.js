const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

app.use(cors());
app.use(express.json());

let redisClient;
let redisReady = false;

async function connectRedis() {
  try {
    redisClient = createClient({ url: REDIS_URL });
    redisClient.on("error", (error) => {
      redisReady = false;
      console.error("Redis error:", error.message);
    });
    await redisClient.connect();
    redisReady = true;
    console.log("Connected to Redis");
  } catch (error) {
    console.warn("Redis unavailable; using in-memory demo data:", error.message);
  }
}

const demoEvents = [
  { id: "evt-001", time: new Date().toISOString(), severity: "CRITICAL", category: "Brute Force", sourceIp: "192.0.2.10", endpoint: "/api/v1/auth/login", method: "POST", status: "INVESTIGATING" },
  { id: "evt-002", time: new Date().toISOString(), severity: "HIGH", category: "SQL Injection", sourceIp: "198.51.100.24", endpoint: "/api/v1/search", method: "GET", status: "OPEN" },
  { id: "evt-003", time: new Date().toISOString(), severity: "MEDIUM", category: "Rate Limit", sourceIp: "203.0.113.15", endpoint: "/api/v1/events", method: "GET", status: "OPEN" },
  { id: "evt-004", time: new Date().toISOString(), severity: "LOW", category: "Suspicious Request", sourceIp: "192.0.2.44", endpoint: "/api/v1/health", method: "GET", status: "MITIGATED" }
];

async function getEvents() {
  if (redisReady) {
    const stored = await redisClient.get("sentinelx:events");
    if (stored) return JSON.parse(stored);
    await redisClient.set("sentinelx:events", JSON.stringify(demoEvents));
  }
  return demoEvents;
}

async function saveEvents(events) {
  if (redisReady) {
    await redisClient.set("sentinelx:events", JSON.stringify(events));
  }
  demoEvents.splice(0, demoEvents.length, ...events);
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "sentinelx-api", redis: redisReady ? "connected" : "unavailable" });
});

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", service: "sentinelx-api", redis: redisReady ? "connected" : "unavailable" });
});

app.get("/api/v1/metrics/kpis", async (_req, res) => {
  const events = await getEvents();
  res.json({
    totalEvents: events.length,
    criticalEvents: events.filter(e => e.severity === "CRITICAL").length,
    requestsPerMinute: 120,
    p95LatencyMs: 48,
    availabilityPercent: 99.98,
    activeApiReplicas: 1,
    dataSource: "demo"
  });
});

app.get("/api/v1/security/events", async (req, res) => {
  let events = await getEvents();
  const q = String(req.query.q || "").toLowerCase();
  const severity = String(req.query.severity || "").toUpperCase();
  const status = String(req.query.status || "").toUpperCase();
  if (q) events = events.filter(e => JSON.stringify(e).toLowerCase().includes(q));
  if (severity) events = events.filter(e => e.severity === severity);
  if (status) events = events.filter(e => e.status === status);

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  res.json({ data: events.slice((page - 1) * limit, page * limit), total: events.length, page, limit, dataSource: "simulated" });
});

app.patch("/api/v1/security/events/:id/status", async (req, res) => {
  const allowed = ["MITIGATED", "BLOCKED", "INVESTIGATING", "OPEN"];
  const status = String(req.body.status || "").toUpperCase();
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });

  const events = await getEvents();
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  event.status = status;
  await saveEvents(events);
  res.json({ data: event });
});

app.get("/api/v1/metrics/events-timeline", (_req, res) => {
  res.json({ data: Array.from({ length: 12 }, (_, i) => ({ time: `${String(i * 2).padStart(2, "0")}:00`, critical: i % 3, high: 3 + (i % 4), medium: 5 + (i % 5), low: 4 + (i % 3) })), dataSource: "simulated" });
});

app.get("/api/v1/metrics/severity-distribution", async (_req, res) => {
  const events = await getEvents();
  res.json({ data: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(severity => ({ severity, count: events.filter(e => e.severity === severity).length })), dataSource: "simulated" });
});

app.get("/api/v1/telemetry/request-rate", (_req, res) => {
  res.json({ requestsPerMinute: 120, blockedPercent: 2.4, dataSource: "demo" });
});

app.get("/api/v1/telemetry/latency", (_req, res) => {
  res.json({ p50: 24, p95: 48, p99: 86, dataSource: "demo" });
});

app.get("/api/v1/infrastructure/services", (_req, res) => {
  res.json({ data: [
    { name: "Frontend", status: "healthy", replicas: 1, cpuPercent: 18, memoryPercent: 42 },
    { name: "API", status: "healthy", replicas: 1, cpuPercent: 24, memoryPercent: 51 },
    { name: "Redis", status: redisReady ? "healthy" : "unavailable", replicas: 1, cpuPercent: 8, memoryPercent: 26 },
    { name: "Worker", status: "demo", replicas: 1, cpuPercent: 12, memoryPercent: 31 }
  ], dataSource: "demo" });
});

app.get("/api/v1/infrastructure/cluster", (_req, res) => {
  res.json({ cluster: "not-connected", nodeCount: 0, dataSource: "demo", note: "Connect Azure Monitor to obtain real cluster telemetry." });
});

app.get("/api/v1/analytics/summary", async (_req, res) => {
  const events = await getEvents();
  res.json({ totalEvents: events.length, categories: [...new Set(events.map(e => e.category))], endpoints: [...new Set(events.map(e => e.endpoint))], dataSource: "simulated" });
});

app.post("/api/v1/security/events/simulate", async (_req, res) => {
  const events = await getEvents();
  const categories = ["Brute Force", "SQL Injection", "Suspicious Request", "Rate Limit"];
  const severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const event = {
    id: `evt-${Date.now()}`,
    time: new Date().toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    sourceIp: "192.0.2.99",
    endpoint: "/api/v1/demo",
    method: "POST",
    status: "OPEN"
  };
  events.unshift(event);
  await saveEvents(events.slice(0, 200));
  res.status(201).json({ data: event, dataSource: "simulated" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  await connectRedis();
  app.listen(PORT, "0.0.0.0", () => console.log(`SentinelX API listening on port ${PORT}`));
}

start();

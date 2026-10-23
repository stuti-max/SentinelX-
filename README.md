# SentinelX — Cloud-Native Security Operations Platform

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TypeScript-E879B9)](frontend)
[![Styling](https://img.shields.io/badge/Theme-Soft%20Pink%20%26%20White-pink)](frontend)
[![Charts](https://img.shields.io/badge/Charts-Recharts-6B3157)](frontend)
[![Cloud](https://img.shields.io/badge/Cloud-Azure%20AKS%20%7C%20Docker-blue)](k8s)
[![Architecture](https://img.shields.io/badge/Architecture-Simulation%20Demo-purple)](#disclaimer)

SentinelX is a cloud-native security-event monitoring demonstration platform designed for modern Security Operations Centers (SOC). The application models security telemetry (SQLi, brute-force auth, rate-limit anomalies, SSRF probes) and pairs it with real-time Kubernetes (AKS) container telemetry, Redis rate-limiting state, and response triage workflows.

> **Project Target**: Final-Year Computer Science Capstone Project, GitHub Portfolio, and Resume Showcase.

---

## 🛡️ Disclaimer

> [!NOTE]  
> **Simulation & Monitoring Demonstration**: SentinelX is designed solely for demonstration, educational, and architectural validation purposes. It does not detect or mitigate real-world cyberattacks without integration into production SIEM, WAF, or IDS/IPS tooling. All security event datasets are generated synthetically by the SentinelX simulation engine.

---

## 📁 Repository Structure

```
SentinelX/
├── backend/       # (Planned) Node.js/Express REST API & Redis ingestion service
├── docs/          # Architecture documentation, API schemas, and deployment guides
├── frontend/      # React 18 + Vite + TypeScript SOC Operations Dashboard
└── k8s/           # (Planned) Kubernetes manifests for Azure Kubernetes Service (AKS)
```

---

## ⚡ Quick Start (Frontend Dashboard)

To run the SOC dashboard locally:

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

The frontend operates in standalone **Simulated Demo Mode** by default, allowing full inspection of all 5 views, real-time simulated event injection, and interactive MITRE ATT&CK modals without needing an active backend.

For detailed frontend documentation, see [frontend/README.md](frontend/README.md).

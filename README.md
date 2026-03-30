<div align="center">

<br/>
<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=CivicAlert&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Local%20Problem%20Solving%20System&descAlignY=60&descSize=20&descColor=94a3b8&animation=fadeIn"/>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=CivicAlert&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Local%20Problem%20Solving%20System&descAlignY=60&descSize=20&descColor=94a3b8&animation=fadeIn" alt="CivicAlert Header"/>
</picture>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-0ea5e9?style=for-the-badge&labelColor=0f172a" alt="Version"/>
  &nbsp;
  <img src="https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge&labelColor=0f172a" alt="License"/>
  &nbsp;
  <img src="https://img.shields.io/badge/status-Active-f59e0b?style=for-the-badge&labelColor=0f172a" alt="Status"/>
  &nbsp;
  <img src="https://img.shields.io/badge/PRs-Welcome-a855f7?style=for-the-badge&labelColor=0f172a" alt="PRs Welcome"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white&labelColor=1e293b"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Flask-2.x-000000?style=flat-square&logo=flask&logoColor=white&labelColor=1e293b"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Claude_AI-Anthropic-D97757?style=flat-square&logo=anthropic&logoColor=white&labelColor=1e293b"/>
  &nbsp;
  <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square&logo=pwa&logoColor=white&labelColor=1e293b"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Leaflet.js-Maps-199900?style=flat-square&logo=leaflet&logoColor=white&labelColor=1e293b"/>
</p>

<br/>

<h3>
  🏙️ &nbsp; AI-powered civic issue reporting &nbsp;·&nbsp; smart triage &nbsp;·&nbsp; real-time resolution tracking
</h3>

<p align="center">
  <i>Empowering citizens. Streamlining governance. Building smarter cities — one complaint at a time.</i>
</p>

<br/>

<p align="center">
  <a href="#-overview"><kbd>Overview</kbd></a> &nbsp;·&nbsp;
  <a href="#-features"><kbd>Features</kbd></a> &nbsp;·&nbsp;
  <a href="#%EF%B8%8F-architecture"><kbd>Architecture</kbd></a> &nbsp;·&nbsp;
  <a href="#-getting-started"><kbd>Getting Started</kbd></a> &nbsp;·&nbsp;
  <a href="#-project-structure"><kbd>Structure</kbd></a> &nbsp;·&nbsp;
  <a href="#-contributing"><kbd>Contributing</kbd></a>
</p>

<br/>
<br/>

</div>

---

<br/>

## 🌆 Overview

**CivicAlert** is a production-grade, full-stack smart city platform that transforms how citizens interact with local government. It eliminates the friction of civic reporting by replacing phone calls, paper forms, and confusion with an intelligent, AI-assisted digital workflow.

At its core, CivicAlert uses **Claude (Anthropic)** to automatically understand, classify, prioritize, and route civic complaints — from a broken streetlight to a collapsed drainage pipe — to the exact department that can fix it, with deadlines enforced, performance tracked, and citizens kept in the loop.

<br/>

```
  BEFORE CivicAlert                     AFTER CivicAlert
  ─────────────────                     ────────────────
  📞 Call helpline → hold music         📱 Report in 30 seconds
  📋 Fill paper form                    🤖 AI classifies instantly
  🤷 No idea who handles it             📍 Auto-routed to department
  📭 Never hear back                    📬 SMS/Email updates
  ❌ Duplicate reports pile up          🔗 Auto-grouped by location
  📊 Zero transparency                  🌐 Public transparency portal
```

<br/>

---

<br/>

## ✨ Features

<br/>

### 👤 &nbsp; Citizen Experience

<table>
<tr>
<td width="50%">

**🔐 Secure Authentication**
Role-based user registration and session management with secure login flows.

**📝 Rich Issue Reporting**
Submit complaints with GPS location, photo evidence, and structured descriptions.

**🤖 CivicBot — AI Assistant**
Conversational guide powered by Claude that walks citizens through the entire reporting process with natural language.

</td>
<td width="50%">

**🏆 Gamification & Rewards**
Citizens earn points for valid, impactful reports — encouraging sustained civic engagement.

**📱 Progressive Web App**
Install CivicAlert directly from the browser. Works offline. No app store required.

**🔔 Real-time Notifications**
Automated email and SMS updates at every stage of complaint resolution.

</td>
</tr>
</table>

<br/>

### 🤖 &nbsp; AI Triage Engine

> Powered by **Claude Sonnet (Anthropic)** — every complaint is analyzed in milliseconds.

| Capability | What it does |
|:---|:---|
| 🧠 **Smart Classification** | Detects issue category — Road, Water, Garbage, Electricity, and more |
| ⚡ **Priority Assignment** | Assigns Urgent / Medium / Low based on severity, keywords, and context |
| 🗺️ **Auto-Routing** | Instantly forwards complaints to the correct civic department |
| 🔗 **Duplicate Grouping** | Clusters nearby, similar reports to prevent redundant workload |
| 🛠️ **Solution Suggestion** | Proposes actionable resolution steps for officers |

<br/>

### 🏛️ &nbsp; Admin & Authority Tools

| Tool | Description |
|:---|:---|
| ⏱️ **SLA Enforcement** | Urgent: 24h · Medium: 72h · Low: 168h — automatic breach detection |
| 📊 **Analytics Dashboard** | Complaint volume, resolution rates, department performance |
| 🗺️ **Geospatial Heatmap** | Live Leaflet.js map showing complaint density by ward/area |
| 🏅 **Officer Leaderboard** | Ranks officers by speed and resolution quality |
| 🌐 **Transparency Portal** | Public-facing ward-level performance dashboard |
| 📬 **Automated Alerts** | Status push notifications to citizens at each stage |

<br/>

---

<br/>

## 🏗️ Architecture

<br/>

```
╔══════════════════════════════════════════════════════════════════╗
║                         CIVICALERT LPRS                         ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   ┌─────────────────────────────────────────────────────────┐   ║
║   │                    FRONTEND LAYER                       │   ║
║   │                                                         │   ║
║   │   HTML5 · CSS3 (Glassmorphism) · Vanilla JavaScript     │   ║
║   │   Leaflet.js  ·  Service Workers  ·  PWA Manifest       │   ║
║   └──────────────────────┬──────────────────────────────────┘   ║
║                          │  HTTP / REST API                      ║
║   ┌──────────────────────▼──────────────────────────────────┐   ║
║   │                    BACKEND LAYER                        │   ║
║   │                                                         │   ║
║   │   Python 3.8+  ·  Flask  ·  Flask-CORS                  │   ║
║   │   JSON Datastores (complaints · users · officers)        │   ║
║   │   SMTP Email  ·  SMS Notifications                      │   ║
║   └──────────────────────┬──────────────────────────────────┘   ║
║                          │  Anthropic SDK                        ║
║   ┌──────────────────────▼──────────────────────────────────┐   ║
║   │                    AI LAYER                             │   ║
║   │                                                         │   ║
║   │   Claude Sonnet  ·  NLP Classification                  │   ║
║   │   CivicBot Chatbot  ·  Smart Grouping Engine            │   ║
║   └─────────────────────────────────────────────────────────┘   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

<br/>

### 🔄 &nbsp; Complaint Lifecycle

```
  CITIZEN                  CIVICALERT                 AUTHORITY
  ───────                  ──────────                 ─────────

  📱 Opens App
       │
       ▼
  📝 Reports Issue ──► 🤖 Claude AI Triage
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
             📂 Categorize        ⚡ Prioritize
             (Road/Water/etc)     (Urgent/Med/Low)
                    │                    │
                    └─────────┬──────────┘
                              │
                              ▼
                    🔗 Duplicate Check ──► Merge if nearby
                              │
                              ▼
                    📡 Route to Department ──────────► 👮 Officer Assigned
                              │                               │
                              ▼                               ▼
                    ⏱️ SLA Timer Starts              🔧 Work Begins
                              │                               │
                              ◄───────── Status Updates ──────┘
                              │
                    📬 Notify Citizen
                              │
                              ▼
                    ✅ Resolved + 🏆 Points Awarded
```

<br/>

---

<br/>

## 🚀 Getting Started

<br/>

### Prerequisites

Ensure the following are installed on your system:

| Requirement | Version | Purpose |
|:---|:---|:---|
| **Python** | `3.8+` | Primary backend runtime |
| **pip** | Latest | Python package manager |
| **Node.js** | `14+` *(optional)* | Only for the Express server alternative |
| **Git** | Any | Version control |

<br/>

### ⚡ Quick Setup

**Step 1 — Clone the repository**

```bash
git clone https://github.com/Bhogi123-T/Local-Problem-Solving-System.git
cd Local-Problem-Solving-System
```

<br/>

**Step 2 — Configure environment variables**

Create a `.env` file in the project root:

```env
# ─── Anthropic AI ────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx

# ─── Flask Security ──────────────────────────────────────────────
SECRET_KEY=your-strong-random-secret-key-here

# ─── Email Notifications (SMTP) ──────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

> 💡 **Get your Anthropic API key** → [console.anthropic.com](https://console.anthropic.com)
>
> 💡 **Generate a Flask secret key** → `python -c "import secrets; print(secrets.token_hex(32))"`

<br/>

**Step 3 — Install dependencies**

```bash
pip install -r requirements.txt
```

<details>
<summary><b>📦 Key dependencies</b></summary>
<br/>

| Package | Purpose |
|:---|:---|
| `flask` | Web framework & routing |
| `flask-cors` | Cross-Origin Resource Sharing |
| `anthropic` | Claude AI SDK |
| `python-dotenv` | Environment variable loading |

</details>

<br/>

**Step 4 — Launch the server**

```bash
python app.py
```

```
 * Running on http://localhost:5000
 * Debug mode: on
 ✓ CivicAlert is live!
```

<br/>

**Step 5 — Open in browser**

```
http://localhost:5000
```

<br/>

> **Alternative: Node.js / Express server**
> ```bash
> npm install
> node server.js
> ```

<br/>

---

<br/>

## 📁 Project Structure

```
Local-Problem-Solving-System/
│
├── 🐍  app.py                    # Flask backend — API routes, AI integration
├── 🟨  server.js                 # Alternative Express.js server
├── 📋  requirements.txt          # Python dependencies
├── 📦  package.json              # Node.js configuration
├── 🔒  .env                      # Environment variables (never commit!)
├── 🔒  .gitignore
│
├── 📊  complaints.json           # Complaint datastore
├── 👥  users.json                # User accounts datastore
├── 👮  officers.json             # Officer profiles datastore
│
└── 🌐  public/                   # Frontend (served statically)
    │
    ├── 🏠  index.html            # Landing page
    ├── 🔐  login.html            # Auth page (login / register)
    ├── 📋  app.html              # Main citizen dashboard
    │
    ├── 🎨  style.css             # Global styles — Glassmorphism UI
    ├── ⚙️   script.js            # Frontend logic, map integration
    │
    ├── 🔧  sw.js                 # Service Worker (PWA offline support)
    └── 📱  manifest.json         # PWA manifest configuration
```

<br/>

---

<br/>

## 📱 Progressive Web App

CivicAlert is fully PWA-compliant — no app store, no downloads. Install it straight from the browser:

| Platform | How to Install |
|:---|:---|
| **Android (Chrome)** | Tap the **⋮** menu → *Add to Home Screen* |
| **iOS (Safari)** | Tap the **Share** icon → *Add to Home Screen* |
| **Desktop (Chrome/Edge)** | Click the **install icon** (⊕) in the address bar |

Once installed, CivicAlert caches critical assets and works even in low-connectivity environments.

<br/>

---

<br/>

## 🛣️ Roadmap

- [x] AI-powered issue classification (Claude Sonnet)
- [x] SLA tracking with automated breach detection
- [x] Geospatial map view with Leaflet.js
- [x] Gamification & citizen reward system
- [x] PWA with offline capability
- [ ] Real database integration (PostgreSQL / MongoDB)
- [ ] Push notifications (Web Push API)
- [ ] Multi-language / i18n support
- [ ] Admin mobile app
- [ ] ML-based trend prediction for proactive civic planning

<br/>

---

<br/>

## 🤝 Contributing

Contributions, bug reports, and feature requests are warmly welcome!

<br/>

**1. Fork & clone**
```bash
git clone https://github.com/YOUR_USERNAME/Local-Problem-Solving-System.git
```

**2. Create a feature branch**
```bash
git checkout -b feat/your-feature-name
```

**3. Commit with conventional commits**
```bash
git commit -m "feat: add ward-level filtering to transparency portal"
git commit -m "fix: SLA timer not resetting on reassignment"
git commit -m "docs: update setup instructions for Windows"
```

**4. Push and open a Pull Request**
```bash
git push origin feat/your-feature-name
```

<br/>

> Please make sure your code is clean, commented, and tested before submitting. For major changes, open an issue first to discuss the approach.

<br/>

---

<br/>

## 🐛 Found a Bug?

Open an issue with the following details:
- **Environment** (OS, Python version, browser)
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)

👉 [Open an Issue](https://github.com/Bhogi123-T/Local-Problem-Solving-System/issues/new)

<br/>

---

<br/>

## 📜 License

```
MIT License

Copyright (c) 2024 Bhogi123-T

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

<br/>

---

<br/>

## 🙌 Acknowledgements

| | |
|:---|:---|
| [**Anthropic**](https://www.anthropic.com/) | Claude AI — powering CivicBot and the smart triage engine |
| [**Leaflet.js**](https://leafletjs.com/) | Beautiful, lightweight interactive maps |
| [**Flask**](https://flask.palletsprojects.com/) | Minimal and elegant Python web framework |
| [**Shields.io**](https://shields.io/) | Beautiful badge generation |
| [**Capsule Render**](https://github.com/kyechan99/capsule-render) | Stunning header/footer banners |

<br/>

---

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=120&section=footer" alt="Footer Wave"/>

<br/>

**Built with ❤️ to make cities smarter and governance more human.**

<br/>

<a href="https://github.com/Bhogi123-T/Local-Problem-Solving-System">
  <img src="https://img.shields.io/github/stars/Bhogi123-T/Local-Problem-Solving-System?style=social" alt="GitHub Stars"/>
</a>
&nbsp;&nbsp;
<a href="https://github.com/Bhogi123-T/Local-Problem-Solving-System/fork">
  <img src="https://img.shields.io/github/forks/Bhogi123-T/Local-Problem-Solving-System?style=social" alt="GitHub Forks"/>
</a>

<br/>
<br/>

*⭐ Star this repository if CivicAlert inspired you!*

</div>

<div align="center">

<br/>

<!-- Logo / Banner -->
<img src="https://img.shields.io/badge/CivicAlert-LPRS-1a73e8?style=for-the-badge&logo=googleearth&logoColor=white" alt="CivicAlert Banner" height="50"/>

<h1>🏙️ CivicAlert — Local Problem Solving System</h1>

<p align="center">
  <strong>An AI-powered smart city platform for transparent, efficient civic issue management.</strong><br/>
  Empowering citizens. Streamlining governance. Resolving problems — faster.
</p>

<br/>

[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Backend-black?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Leaflet.js](https://img.shields.io/badge/Leaflet.js-Maps-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<br/>

<a href="#-features">Features</a> •
<a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
<a href="#-getting-started">Getting Started</a> •
<a href="#-project-structure">Project Structure</a> •
<a href="#-contributing">Contributing</a>

<br/><br/>

</div>

---

## 📌 Overview

**CivicAlert** is a full-stack, AI-assisted civic issue reporting and resolution platform built for modern municipalities. It bridges the gap between citizens and local government by providing a transparent, data-driven, and gamified workflow for identifying and resolving civic problems.

Whether it's a **pothole on Main Street**, a **burst water pipe**, a **power outage**, or **uncollected garbage** — CivicAlert intelligently classifies, routes, tracks, and resolves it end-to-end.

> Built with a Flask backend, Vanilla JS frontend, Anthropic Claude AI integration, and full Progressive Web App (PWA) support.

---

## ✨ Features

### 👤 Citizen Portal
| Feature | Description |
|---|---|
| 🔐 Secure Auth | Role-based user registration, login, and session management |
| 📝 Issue Reporting | Submit complaints with location, description, and photo evidence |
| 🤖 CivicBot | AI chatbot (powered by Claude) to guide users through the reporting process |
| 🏆 Gamification | Earn reward points for valid reports, encouraging civic participation |
| 📱 PWA Support | Installable web app with offline capability on mobile & desktop |

### 🤖 AI-Powered Triage Engine
| Feature | Description |
|---|---|
| 🧠 Auto Classification | Claude AI assesses **priority** (Urgent / Medium / Low), **category** (Road / Water / Garbage / Electricity), and suggests solution steps |
| 🔗 Auto-Grouping | Detects and clusters duplicate/nearby reports to prevent redundant work |
| ⚡ Real-time Routing | Instantly routes issues to the responsible civic department |

### 🏛️ Admin & Authority Dashboard
| Feature | Description |
|---|---|
| ⏱️ SLA Tracking | Deadline enforcement per priority: Urgent = 24h, Medium = 72h, Low = 168h |
| 📊 Analytics Dashboard | Visualizes complaints by priority, status, department, and resolution rate |
| 🗺️ Geospatial Map View | Real-time map visualization of complaint hotspots using Leaflet.js |
| 🏅 Officer Leaderboard | Ranks officers by resolution speed and performance |
| 🌐 Transparency Portal | Public-facing ward-level resolution efficiency tracker |
| 📬 Automated Alerts | Email/SMS notifications for complaint status updates |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│  HTML5 · CSS3 (Glassmorphism) · Vanilla JavaScript      │
│  Leaflet.js (Maps) · Service Workers · PWA Manifest     │
├─────────────────────────────────────────────────────────┤
│                     BACKEND                             │
│  Python 3.8+ · Flask · Flask-CORS                       │
│  JSON File-based Datastores (complaints / users)        │
│  Optional: Node.js + Express (server.js)                │
├─────────────────────────────────────────────────────────┤
│                    AI INTEGRATION                       │
│  Anthropic SDK · Claude Sonnet · NLP Classification     │
│  Chatbot (CivicBot) · Smart Issue Grouping              │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Python** `3.8+` — [Download](https://www.python.org/downloads/)
- **pip** — comes bundled with Python
- **Node.js** *(optional)* — only needed if using the Express server alternative

---

### ⚙️ Installation

**1. Clone the repository**
```bash
git clone https://github.com/Bhogi123-T/Local-Problem-Solving-System.git
cd Local-Problem-Solving-System
```

**2. Set up environment variables**

Create a `.env` file in the root directory:
```env
# Anthropic AI
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Flask
SECRET_KEY=your_flask_secret_key_here

# Email Notifications (SMTP)
SMTP_HOST=smtp.yourmailprovider.com
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

> 💡 Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com)

**3. Install Python dependencies**
```bash
pip install -r requirements.txt
```

Key dependencies include:
- `flask` — Web framework
- `flask-cors` — Cross-Origin Resource Sharing
- `anthropic` — Claude AI SDK
- `python-dotenv` — Environment variable management

**4. Start the server**
```bash
python app.py
```

**5. Open the app**

Navigate to: **[http://localhost:5000](http://localhost:5000)**

---

### 🟡 Optional: Run with Node.js / Express

If you prefer the lightweight Express alternative:
```bash
npm install
node server.js
```

---

## 📁 Project Structure

```
Local-Problem-Solving-System/
│
├── 📄 app.py                  # Main Flask backend server
├── 📄 server.js               # Alternative Express.js server
├── 📄 requirements.txt        # Python dependencies
├── 📄 package.json            # Node.js config
├── 📄 .env                    # Environment variables (gitignored)
│
├── 📊 complaints.json         # Complaint data store
├── 📊 users.json              # User data store
├── 📊 officers.json           # Officer data store
│
└── 📁 public/                 # Frontend assets
    ├── 🌐 index.html          # Landing page
    ├── 🔐 login.html          # Authentication page
    ├── 📋 app.html            # Main citizen dashboard
    ├── 🎨 style.css           # UI styles (Glassmorphism)
    ├── ⚙️  script.js          # Frontend logic & map integration
    ├── 🔧 sw.js               # Service Worker (PWA offline support)
    └── 📱 manifest.json       # PWA configuration
```

---

## 🔄 How It Works

```
Citizen Reports Issue
        │
        ▼
  CivicBot Guidance (Claude AI)
        │
        ▼
  AI Triage Engine
  ├── Classifies Category (Road / Water / Garbage / Electricity)
  ├── Assigns Priority (Urgent / Medium / Low)
  └── Suggests Resolution Steps
        │
        ▼
  Auto-Grouping (checks for nearby duplicates)
        │
        ▼
  Routes to Relevant Department
        │
        ▼
  SLA Timer Starts → Officer Assigned
        │
        ▼
  Resolution Tracked → Citizen Notified
        │
        ▼
  Analytics Updated + Reward Points Issued
```

---

## 🌐 PWA — Install as Mobile App

CivicAlert is a **Progressive Web App** — you can install it directly on your phone or desktop without an app store:

1. Open the app in your browser
2. Click **"Add to Home Screen"** (mobile) or the install icon in the URL bar (desktop)
3. Use it like a native app — even with limited connectivity!

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and ensure your code is clean and well-commented.

---

## 🐛 Reporting Bugs / Feature Requests

Found a bug or have a suggestion? [Open an issue](https://github.com/Bhogi123-T/Local-Problem-Solving-System/issues) — we appreciate detailed reports!

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```
MIT License — Free to use, modify, and distribute with attribution.
```

---

## 🙌 Acknowledgements

- [Anthropic](https://www.anthropic.com/) — for Claude AI powering CivicBot and smart triage
- [Leaflet.js](https://leafletjs.com/) — for lightweight, interactive maps
- [Flask](https://flask.palletsprojects.com/) — for the clean Python web framework

---

<div align="center">

<br/>

**CivicAlert** — *Making Cities Smarter, One Report at a Time.*

<br/>

⭐ **If you found this project useful, please consider giving it a star!** ⭐

</div>

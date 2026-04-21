---
title: TriAIge-Live
emoji: 🏥
colorFrom: blue
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# TriAIge -- AI-Powered Emergency Triage System
for Indian Government Hospitals

TriAIge is an intelligent triage system designed to streamline emergency admissions in Indian government hospitals. It integrates digital health stacks (ABHA, PM-JAY), multilingual voice-based symptom intake, and real-time ambulance synchronization to ensure critical patients receive immediate care.

---

## 🚀 Live Demo
- **🏥 Hospital Dashboard:** [https://still-learned-ben-crew.trycloudflare.com](https://still-learned-ben-crew.trycloudflare.com)
- **🚚 Live Public Tracker:** [https://still-learned-ben-crew.trycloudflare.com/tracker/AMB-108](https://still-learned-ben-crew.trycloudflare.com/tracker/AMB-108)

*(Note: These are temporary tunnel links active during the demo session. For a permanent deployment, follow the instructions below.)*

---

## 🏥 Key Features
- **Multilingual Voice Intake:** Speak in 10+ Indian languages (Hindi, Tamil, Telugu, etc.) to report symptoms. Powered by **Sarvam AI STT** and processed by **Claude 3.5 Sonnet**.
- **Instant Triage Scoring:** AI-generated severity scoring (1-10) and category assignment (RED/YELLOW/GREEN) based on clinical protocol.
- **ABHA & PM-JAY Integration:** Seamless lookup of patient history and insurance coverage (Mocked for Demo).
- **Ambulance Live-Feed:** Real-time synchronization of incoming patient vitals via WebSockets.
- **WhatsApp Notifications:** Automatic family updates via Twilio WhatsApp API.

---

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend:** FastAPI (Python), Socket.io, httpx.
- **Infrastructure:** Docker, Render Blueprint.

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RV6730/TriAIge.git
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn main:socket_app --reload
   ```

3. **Frontend Setup:**
   ```bash
   npm install
   npm run dev
   ```

---

## ☁️ Permanent Deployment Instructions

### Option 1: Render (Recommended)
This repo includes a `render.yaml` blueprint for 1-click full-stack deployment.
1. Connect your GitHub to [Render.com](https://render.com).
2. Go to **Blueprints** -> **New Blueprint**.
3. Select this repository and click **Deploy**.

### Option 2: HuggingFace Spaces
1. Create a new **Docker Space** on [HuggingFace](https://huggingface.co/spaces).
2. Connect this GitHub repo.
3. HuggingFace will build the included `Dockerfile` and your site will be live!

---

## 📄 License
This project is part of a hackathon prototype and is open-source.

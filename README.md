---
title: TriAIge Live
emoji: 🏥
colorFrom: blue
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 🏥 TriAIge: AI-Powered Emergency Triage System

**TriAIge** is a state-of-the-art, AI-driven emergency management and disease surveillance platform designed for Indian government hospitals. It optimizes hospital queues, tracks disease outbreaks in real-time, and provides actionable health insights to both administrators and the public.

---

## 🚀 Key Features

### 1. **AI-Driven Emergency Triage**
- **Voice-Activated Intake**: Emergency staff can record patient symptoms via voice; the AI automatically transcribes and categorizes the patient.
- **Priority Scoring**: Patients are instantly assigned a Triage Level (Level 1: Immediate to Level 5: Non-Urgent) based on clinical severity.
- **Smart Queue Management**: Dynamic sorting ensures that life-threatening cases are seen first, reducing wait times for critical care.

### 2. **Regional Disease Surveillance**
- **Hotspot Tracking**: Real-time monitoring of disease surges (Dengue, Malaria, Gastroenteritis, etc.) across various Taluks (Bengaluru South, Anekal, etc.).
- **Interactive Criticality Maps**: Visual indicators for **CRITICAL**, **HIGH**, and **MEDIUM** risk zones.
- **Precautions & Guidance**: Specific, actionable guidelines for each regional outbreak, helping officials coordinate local health workers.

### 3. **Public Health Awareness**
- **Hygiene Standards**: Comprehensive daily lifestyle guidelines (Hand hygiene, Water safety, Food standards) to prevent community spread.
- **Disease Precautions**: Dedicated awareness modules for common seasonal illnesses.

### 4. **Live Resource Tracking**
- **Ambulance Telemetry**: Real-time vitals and GPS tracking for incoming emergency vehicles.
- **Hospital Capacity**: Monitor bed availability and ER load across the region.

---

## 🛠️ Technology Stack

- **Frontend**: React.js with Tailwind CSS for a premium, responsive glassmorphism UI.
- **Backend**: FastAPI (Python) for high-performance asynchronous API processing.
- **AI/ML**: Integrated transcription and triage logic.
- **Data Visualization**: Recharts for dynamic, interactive health trends.
- **Deployment**: Dockerized multi-stage builds for stability on Hugging Face Spaces.

---

## 💻 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RV6730/TriAIge.git
   cd TriAIge
   ```

2. **Backend Setup**:
   ```bash
   # Create a virtual environment
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the server
   uvicorn main:socket_app --reload --port 8000
   ```

3. **Frontend Setup**:
   ```bash
   npm install
   npm run dev
   ```

---

## ☁️ Deployment

This project is optimized for **Hugging Face Spaces** using Docker. The configuration is stored in the `Dockerfile` at the root, which:
- Uses a Python 3.10 base image.
- Serves the pre-built React frontend from the `/dist` directory.
- Exposes the app on port **7860**.

---

## 🛡️ Daily Hygiene Standards
*Maintain these to stay safe:*
- **Soap & Water**: Wash hands for 20s before meals.
- **Filtered Water**: Only consume boiled or UV-filtered water.
- **Ventilation**: Ensure cross-ventilation in living spaces.
- **Fumigation**: Coordinate with local bodies for mosquito control in high-risk zones.

---
*Developed for the Future of Healthcare in India.*

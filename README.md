---
title: TriAIge Live
emoji: 🏥
colorFrom: blue
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 🏥 TriAIge: Surveillance-First Emergency Management

**TriAIge** is an integrated health platform where **Regional Disease Surveillance** drives the **Emergency Triage** process. By identifying disease hotspots and regional criticalities first, the system intelligently prioritizes patient intake based on the prevailing health threats in their specific area.

---

## 🎯 Project Core Perspective

### 1. **Predictive Disease Surveillance**
The heart of TriAIge is its ability to monitor regional health trends across various Taluks.
- **Regional Hotspots**: Identifies where diseases like Dengue, Malaria, or Gastroenteritis are surging.
- **Criticality Mapping**: Assigns severity levels (**CRITICAL**, **HIGH**, **MEDIUM**, **LOW**) to specific regions.
- **Data-Driven Insights**: Uses weekly trends to predict upcoming outbreaks before they overwhelm hospitals.

### 2. **Public Precautions & Hygiene Standards**
Before a patient reaches the hospital, TriAIge focuses on prevention.
- **Localized Precautions**: When a Taluk is marked as "Critical," the system provides specific, immediate precautions for that region.
- **Daily Hygiene Standards**: Promotes government-standard hygiene practices (Hand hygiene, Water safety, Food standards) to break the chain of infection.

### 3. **Surveillance-Linked Patient Triage**
Patient intake is not just based on symptoms, but on the **regional context** provided by the surveillance data.
- **Contextual Priority**: If a patient comes from a "Critical" hotspot for Dengue, their triage priority is automatically elevated for faster screening.
- **Voice-Activated Intake**: Efficiently handles high-volume intake during regional outbreaks through AI-powered transcription and categorization.

---

## 🚀 Key Features

- **Interactive Hotspot Dashboard**: Click-to-view details on regional outbreaks and specific health guidance.
- **Dynamic Bar Charts**: Visualizes case volumes by Taluk with color-coded severity levels.
- **Smart Queue Management**: Ensures critical cases from high-risk zones are prioritized.
- **Resource Telemetry**: Track incoming ambulances and hospital load in real-time.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite 8) with a premium Tailwind CSS Glassmorphism UI.
- **Backend**: High-performance FastAPI (Python) with Socket.io for real-time telemetry.
- **Deployment**: Dockerized on Hugging Face Spaces for 24/7 availability.
- **Visualization**: Recharts for interactive disease trends and Taluk metrics.

---
*Bridging the gap between Regional Surveillance and Emergency Care.*

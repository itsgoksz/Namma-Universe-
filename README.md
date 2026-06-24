# 🤖 Aiva — AI Receptionist for Salons & Small Businesses

Aiva is a production-ready SaaS platform that acts as an AI-powered receptionist. It answers phone calls, books appointments, manages customers, and provides business analytics — all automatically.

## ✨ Features

- **AI Voice Receptionist** — Answers calls 24/7 using Vapi AI or Retell AI
- **Smart Booking** — AI checks availability and books appointments in real-time
- **Customer Management** — Track visits, reliability scores, and preferences
- **Call History** — Full transcripts, recordings, and outcome tracking
- **Service & Staff Management** — Configure offerings and team availability
- **Analytics Dashboard** — Revenue trends, popular services, AI performance metrics
- **Automated Notifications** — SMS, WhatsApp, and email confirmations & reminders
- **No-Show Detection** — Automatic tracking with customer reliability scoring
- **Human Escalation** — Seamless call transfer with logged reasons

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · TypeScript · TailwindCSS v4 · Recharts |
| Backend | FastAPI · SQLAlchemy (async) · Pydantic v2 |
| Database | PostgreSQL 16 · Redis 7 |
| Voice AI | Vapi AI · Retell AI (pluggable) |
| Notifications | Twilio (SMS/WhatsApp) · SendGrid (Email) |
| Infrastructure | Docker Compose |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker & Docker Compose (for PostgreSQL + Redis)

### 1. Start Infrastructure
```bash
docker compose up -d db redis
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy and configure environment
cp ../.env.example .env

# Run the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

## 📁 Project Structure

```
Aiva/
├── frontend/          # React + TypeScript + TailwindCSS
│   └── src/
│       ├── components/  # Reusable UI & layout components
│       ├── features/    # Feature modules (pages)
│       ├── lib/         # API client, utilities
│       └── types/       # TypeScript definitions
├── backend/           # FastAPI + SQLAlchemy
│   └── app/
│       ├── api/        # REST endpoints + webhooks
│       ├── core/       # Config, security, database
│       ├── models/     # ORM models
│       ├── schemas/    # Pydantic schemas
│       ├── services/   # Business logic
│       ├── voice/      # Voice provider adapters
│       └── notifications/
├── docker-compose.yml
└── .env.example
```

## 🔌 API Documentation

Once the backend is running, API docs are available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📞 Voice Integration

Aiva supports two voice AI providers:

1. **Vapi AI** (default) — Set webhook URL to: `https://your-domain/api/webhooks/vapi/{business_id}`
2. **Retell AI** — Set webhook URL to: `https://your-domain/api/webhooks/retell/{business_id}`

## 📄 License

MIT

# 장단:음 (Jangdan:um) / RebalAI

An AI-powered daily rhythm and schedule balancing application.

## Structure

```
├── frontend/          React + TypeScript + Vite web app
│   ├── src/           UI components, screens, state
│   ├── expo/          React Native / Expo version
│   └── ...
├── backend/           Express + Supabase API server
│   └── src/           Routes, middleware, services
└── ...
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
```

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in Supabase credentials
npm run dev            # http://localhost:4000
```

## Docs

Frontend README: [frontend/README.md](frontend/README.md)

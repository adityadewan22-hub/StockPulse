🚀 StockPulse — Real-Time Stock Analytics & Portfolio Tracker

StockPulse is a full-stack real-time stock analytics platform built with Next.js 15, Express.js, MongoDB, and WebSockets (Socket.IO).
It provides live price updates, personalized portfolios, buy/sell tracking, investment summaries, and a dashboard UI built using modern frontend patterns.

This project reflects my skills in building production-grade systems, architecting clean data flows, and shipping complete features end-to-end.

🌟 Features
🔹 Real-Time Live Prices

WebSocket connection to backend

Auto-updating watchlist and dashboard

Graceful fallback to REST API when market is closed

🔹 Portfolio Management

Buy & sell model

Tracks holdings, quantities, and cost basis

Computes investment value using live prices

Stores user-specific portfolio using JWT-protected APIs

Fixed “global portfolio” issue by introducing per-user schema binding

🔹 Authentication + Protected Routes

JWT-based auth

Secure login/register

Role-ready design (if expanded in future)

Persistent session handling on client

🔹 Dashboard

Portfolio summary cards

Investment charts (Recharts)

Animated UI with Framer Motion

Holdings table with real-time valuations

🔹 Caching Layer (In Progress / Optional)

Redis setup for storing frequently-requested prices

Reduces unnecessary external API calls

Supports TTL-based invalidation

🔹 Full Deployment

Frontend: Vercel

Backend: Render

Environment variables handled securely via .env

Production-grade troubleshooting of CORS, cold starts, WebSocket upgrades

🛠️ Tech Stack
Frontend

Next.js 15

React

TypeScript

Shadcn UI

Recharts

Framer Motion

Backend

Node.js / Express

Socket.IO

MongoDB + Mongoose

JWT Auth

Redis (optional caching layer)

DevOps / Deployment

Vercel (SSR/CSR handling, environment variables)

Render (Express app, WebSockets, scaling)

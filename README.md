# FormulaOS

**Your formulas. Named, saved, and sold.**

FormulaOS is a lightweight, AI-powered spreadsheet application built for non-technical users. Search formulas in plain English, save them to your personal library, and sell them on the marketplace.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Zustand |
| Spreadsheet | FortuneSheet (open-source Luckysheet fork) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth (Passport.js) |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Payments | Stripe + Stripe Connect (scaffolded) |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone & Install

```bash
# Server
cd formulaos/server
cp .env.example .env    # Fill in your API keys
npm install

# Client
cd ../client
cp .env.example .env    # Fill in your API keys
npm install
```

### 2. Configure Environment Variables

**Server (.env):**
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Any secure random string
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google Cloud Console
- `ANTHROPIC_API_KEY` — Anthropic Console
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe Dashboard

**Client (.env):**
- `VITE_API_URL` — Backend API URL (default: http://localhost:5000/api)
- `VITE_GOOGLE_CLIENT_ID` — Same as server
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd formulaos/server
npm run dev

# Terminal 2 — Frontend
cd formulaos/client
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Core Features

### 🔍 Smart Formula Search Bar
Type in plain English → fuzzy search across 80+ built-in formulas, your personal library, and the marketplace. Empty state leads to AI generation.

### 📚 Personal Formula Library
Save any formula with a name, description, and tags. Reuse across spreadsheets. Track usage.

### 🤖 AI Formula Generator
Describe what you need → Claude generates the formula + step-by-step explanation. 20 free generations/month.

### 💡 Formula Explainer
Click any formula → get a plain-English breakdown of what it does.

### 🏪 Formula Marketplace
Browse, search, and download community formulas. Upload your own (free or paid $1-$49).

### 💳 Stripe Payments
Purchase paid formulas via Stripe Checkout. Platform takes 20% fee. Creator payouts via Stripe Connect (Phase 2).

## Project Structure

```
formulaos/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components by feature
│   │   ├── pages/          # Route pages
│   │   ├── store/          # Zustand state stores
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Helpers, formula index
│   │   └── index.css       # Design system
│   └── ...
├── server/                 # Express backend
│   ├── config/             # DB + Passport config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, rate limit, errors
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   └── utils/              # Token gen, validators
└── README.md
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register with email/password |
| POST | /api/auth/login | Login |
| GET | /api/auth/google | Google OAuth redirect |
| GET | /api/auth/me | Current user profile |
| GET | /api/formulas | User's saved formulas |
| POST | /api/formulas | Save new formula |
| PUT | /api/formulas/:id | Update formula |
| DELETE | /api/formulas/:id | Delete formula |
| GET | /api/marketplace | Browse marketplace |
| POST | /api/marketplace/upload | Upload to marketplace |
| POST | /api/ai/generate | AI formula generation |
| POST | /api/ai/explain | AI formula explanation |
| POST | /api/payments/checkout | Stripe checkout |
| POST | /api/payments/webhook | Stripe webhook |
| GET | /api/users/:id/profile | Creator profile |

## Design

- **Dark theme**: Deep navy (#0D1117) background
- **Accent colors**: Electric teal (#00D4AA) + Soft gold (#F5C842)
- **Glassmorphism** cards with backdrop blur
- **Smooth animations** on all modals and transitions
- **Mobile responsive** marketplace and library

## Built by Dikshyant

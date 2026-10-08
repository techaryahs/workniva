# You Work

You Work is a premium on-demand workspace and meeting room booking platform. This project provides a robust, production-ready solution encompassing a modern frontend UI, a secure Node.js backend, Supabase (PostgreSQL) data management, Razorpay payment processing, and comprehensive Email/WhatsApp notification pipelines.

## Architecture

The platform follows a strictly separated architecture:

- **frontend/**: React, Vite, TypeScript, Tailwind CSS, Framer Motion. Handles the user interface, booking flows, admin dashboard, and integrates Razorpay Checkout. No sensitive credentials exist here.
- **backend/**: Node.js, Express, TypeScript. Functions as the authoritative gateway. Handles authentication verification, payment order creation, webhook verification, availability re-checking, notification dispatching, rate limiting, and database interactions using the Supabase Service Role Key to bypass client-level RLS limitations.

## Getting Started

### Prerequisites

- Node.js v18+
- Supabase Project (with Auth and PostgreSQL)
- Razorpay Account (Test Mode)
- SMTP Server (e.g. SendGrid, Mailgun)
- Meta WhatsApp Business API Account

### Supabase Setup

1. In your Supabase SQL Editor, sequentially execute the migrations found in \`supabase/migrations/\`:
   - \`schema.sql\` (Phase 5: Core booking, pricing, profiles, RLS, double-booking exclusion constraints)
   - \`payment.sql\` (Phase 6: Payment tracking table, pending_payment status updates)
   - \`notifications.sql\` (Phase 7: Notification and webhook event idempotency tables)

### Environment Variables

#### Backend
Create \`backend/.env\` based on \`backend/.env.example\`:
\`\`\`
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_user
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@rentoffice.com
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
\`\`\`

#### Frontend
Create \`frontend/.env\` based on \`frontend/.env.example\`:
\`\`\`
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
\`\`\`

## Development Commands

**Backend:**
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
*Runs on http://localhost:5000*

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*Runs on http://localhost:5173*

## Production Build

**Backend:**
\`\`\`bash
cd backend
npm run build
npm start
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run build
\`\`\`
*(Deploy the \`dist\` folder to Vercel, Netlify, or any static host)*

## Security Features

- **Double Booking Protection:** Relies on native PostgreSQL GiST exclusion constraints \`(EXCLUDE USING gist)\` to mathematically prevent overlapping bookings.
- **Data Privacy:** Strict Row-Level Security (RLS) ensures users can only read/write their own records.
- **Payment Reconciliation:** Backend creates independent Razorpay orders and cryptographically verifies webhook HMAC signatures before confirming bookings.
- **API Hardening:** Equipped with \`helmet\` for HTTP headers, \`express-rate-limit\` to throttle endpoints, and strict payload size limits.

## Deployment Preparation

- Remember to switch Razorpay from Test mode to Live mode and update your backend secrets.
- Register your official webhook endpoint in the Razorpay dashboard: \`https://your-backend.com/api/payments/webhook\`
- Securely configure your \`FRONTEND_URL\` in the backend environment to enable tight CORS restrictions.

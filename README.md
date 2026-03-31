# Talk-A-Tive Backend

Backend API for Talk-A-Tive chat app.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Socket.IO (local/non-serverless runtime)
- Ably publish API (for serverless-friendly realtime fanout)

## Recommended Runtime

- Node 18

## Environment Variables

Create backend/.env:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret

# Comma-separated allowed origins
CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app

# Optional (recommended for Vercel/full realtime fanout)
ABLY_API_KEY=your_ably_api_key
```

Notes:

- Keep values plain (no extra quotes unless required by your shell setup).
- If deploying frontend and backend separately, add frontend URL in CORS_ORIGIN.

## Install

From repository root:

```bash
npm --prefix backend install --legacy-peer-deps
```

Or from backend directory:

```bash
cd backend
npm install --legacy-peer-deps
```

## Run Locally

From repository root:

```bash
npm --prefix backend run server
```

Or from backend directory:

```bash
cd backend
npm run server
```

Default URL: http://localhost:5000

## Core API Areas

- User authentication and profile
- Chat create/list/group update
- Message send, edit, delete
- Unread + read-sync APIs
  - GET /api/message/unread
  - PUT /api/message/read/:chatId

## Realtime Behavior

- Local/traditional server runtime:
  - Socket.IO events are active.
- Serverless runtime (for example Vercel):
  - Socket server is not persisted.
  - Backend publishes message/notification events via Ably when ABLY_API_KEY is configured.

## Deployment Notes

- Vercel entry is wired via backend/api/index.js and backend/vercel.json.
- Ensure all required env vars are set in Vercel project settings.
- If client sees CORS errors, re-check CORS_ORIGIN values.

## Troubleshooting

- Mongo connection fails:
  - Verify MONGO_URI and network access to MongoDB.
- 401/auth issues:
  - Verify JWT_SECRET and token flow.
- Realtime delay in serverless:
  - Set ABLY_API_KEY and ensure frontend has matching REACT_APP_ABLY_KEY.


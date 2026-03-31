# Talk-A-Tive Backend

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Work+Sans&weight=700&size=26&duration=2400&pause=900&color=FF8A00&center=true&vCenter=true&width=860&lines=Talk-A-Tive+Backend;Express+%2B+MongoDB+%2B+Socket.IO;Auth+%7C+Chats+%7C+Messages+%7C+Notifications" alt="Backend animated heading" />
</p>

Backend API and Socket.IO server for Talk-A-Tive.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Socket.IO

## Prerequisites

- Node.js installed
- MongoDB connection string

Recommended runtime for this project:

- Node 18

## Environment Variables

Create file: backend/.env

```env
MONGO_URI="your_mongodb_connection_string"
PORT=5000
JWT_SECRET="your_secret"
```

## Install

From project root:

```bash
npm --prefix backend install --legacy-peer-deps
```

Or inside backend folder:

```bash
cd backend
npm install --legacy-peer-deps
```

## Run

From project root:

```bash
npm --prefix backend run server
```

Or inside backend folder:

```bash
cd backend
npm run server
```

Backend URL:

- http://localhost:5000

## Main API Areas

- User auth and profile
- Chat creation and listing
- Group chat management
- Message send, edit, delete
- Unread notifications and mark-as-read

## Notes

- Scripts are configured to run backend with Node 18 compatibility:
  - start
  - server
- If PORT 5000 is already in use, stop existing process and rerun.

## Quick Troubleshooting

- MongoDB connection error:
  - verify MONGO_URI in backend/.env
- JWT/auth error:
  - verify JWT_SECRET in backend/.env
- Module not found:
  - run install again in backend


# La3eeb — Tournament Organizer (Backend)

Backend API for **La3eeb** Tournament Organizer built with **Node.js + Express + MongoDB (Mongoose)**.
Supports authentication, role-based authorization (admin/user), tournaments, stadiums, matches, teams, join requests with real-time confirmation (Socket.io), and AI tournament insights.

---

## Key Features
- **Auth**: JWT (access/refresh)
- **Roles & Permissions**: admin/user (admin-only endpoints require role=admin)
- **Core Flow**: Join Requests with real-time confirmation (Socket.io) + approve/reject
- **CRUD**:
  - Tournaments
  - Stadiums
  - Matches
  - Teams
- **AI Insights**: server-side tournament insights, JWT-protected

---

## Tech Stack
- Node.js, Express
- MongoDB, Mongoose
- Socket.io
- dotenv
- bcrypt
- express-validator
- (Optional) AI provider SDK (Google / OpenAI / etc.)

---

## Database Entities (MongoDB Collections)
### `users`
- firstName, lastName
- email (unique)
- passwordHash
- role: user | admin
- createdAt, updatedAt

### `teams`
- name
- ownerUserId (ref users)
- members: [userId] (refs users)
- createdAt, updatedAt

### `tournaments`
- title, sportType, mode (solo/team/both)
- startDate, endDate, status (draft/open/ongoing/finished)
- rules, maxParticipants/maxTeams (optional)
- createdByAdminId (ref users)
- participantsUsers: [userId] (solo)
- participantsTeams: [teamId] (team)
- createdAt, updatedAt

### `matches`
- tournamentId (ref tournaments)
- stadiumId (ref stadiums)
- startTime, endTime
- sideA: { type, refId } and sideB: { type, refId } (user/team)
- scoreA/scoreB (optional)
- status (scheduled/live/finished/cancelled)
- createdAt, updatedAt

### `stadiums`
- name
- city, address, mapLink (optional)
- capacity, facilities (optional)
- status: available | unavailable (optional)
- createdAt, updatedAt

### `joinRequests`
- tournamentId (ref tournaments)
- requestType: solo | team
- userId (ref users)
- teamId (ref teams, optional)
- status: pending | confirm_sent | confirmed | approved | rejected
- userConfirmedAt, adminNotes (optional)
- createdAt, updatedAt

---

## Core Flow — Join Request (Real-Time Confirmation)
Status lifecycle:
`pending → confirm_sent → confirmed → approved | rejected`

High-level:
1) User joins tournament (solo/team) → create JoinRequest `pending`
2) Admin sends confirmation (Socket.io) → `confirm_sent`
3) User replies Yes/No
   - Yes → `confirmed`
4) Admin approves/rejects → `approved` / `rejected`
5) On approval → add user/team to tournament participants

---

## Environment Variables
Create `.env`:

```env
PORT=8008
MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

CLIENT_URL=http://localhost:5173

# Optional (AI)
AI_PROVIDER=google|openai|none
AI_API_KEY=your_key
```

## Requiernments
```
# create project folder
mkdir your-project-name
cd your-project-name

# backend folder
mkdir server
cd server

# init npm
npm init -y

# core deps
npm i express mongoose dotenv

# create files
touch server.js
touch .env
touch .gitignore

# will cover later on ->>>
npm install cors
npm install socket.io

# AI SDK
npm i openai

```

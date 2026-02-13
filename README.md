# PeerDrop

PeerDrop is a **P2P file transfer website**.

It lets users connect directly in the browser and share files peer-to-peer using WebRTC, while a Socket.IO signaling server helps peers discover each other and exchange connection data.

## Project Structure

- `apps/web` — Next.js frontend (user interface + WebRTC peer logic)
- `apps/server` — Node.js + Express + Socket.IO signaling server

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Realtime signaling: Socket.IO
- Peer-to-peer connection: WebRTC (`simple-peer`)
- Backend: Express, TypeScript

## Getting Started

### 1) Run the signaling server

```bash
cd apps/server
pnpm install
pnpm dev
```

Server runs on `http://localhost:4000`.

### 2) Run the web app

Open another terminal:

```bash
cd apps/web
pnpm install
pnpm dev
```

Web app runs on `http://localhost:3000`.

## How It Works (High Level)

1. A user joins a room.
2. The server notifies peers in the same room.
3. Peers exchange WebRTC signaling data through Socket.IO.
4. A direct P2P connection is established.
5. Files are transferred directly between peers.

## Notes

- The signaling server only coordinates connections; file data is sent peer-to-peer.
- For production, configure CORS and room/security rules properly.

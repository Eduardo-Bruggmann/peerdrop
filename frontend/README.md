This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## WebRTC (STUN/TURN)

For reliable mobile-to-desktop transfers, configure TURN in `frontend/.env.local`:

```bash
NEXT_PUBLIC_STUN_URLS=stun:stun.l.google.com:19302
NEXT_PUBLIC_TURN_URLS=turn:YOUR_TURN_HOST:3478,turns:YOUR_TURN_HOST:5349
NEXT_PUBLIC_TURN_USERNAME=YOUR_USERNAME
NEXT_PUBLIC_TURN_CREDENTIAL=YOUR_PASSWORD

# Optional: force relay only (use TURN even when direct P2P is possible)
NEXT_PUBLIC_WEBRTC_FORCE_RELAY=false
```

Notes:

- `NEXT_PUBLIC_TURN_URLS` accepts multiple URLs separated by commas.
- In production, prefer `turns:` and valid TLS certs.
- If TURN is unavailable, connection may still work in desktop-to-desktop but fail on mobile networks.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

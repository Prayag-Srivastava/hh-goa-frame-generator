# GOA//FRAME

Premium one-of-one identity card and PFP generator for Hacker House Goa 2026.

## Stack
Vite + React 18 + TypeScript, Tailwind CSS v4 with Goa theme tokens, Framer Motion, html2canvas-pro, face-api.js, heic2any, Howler.js, React Router, Zustand, lucide-react, react-hot-toast. No backend.

## Features
- Hero landing, `/create`, `/card/:id`, `/hall-of-fame`
- Robust image upload including HEIC conversion, canvas normalization, face-api client-side detection with center-crop fallback
- 5-question archetype quiz yielding 8 Goa hacker archetypes
- 8 SVG/CSS animated PFP frame styles plus secret Golden Hour unlock
- 6 distinct ID layouts: passport, boarding pass, visa, trading card, terminal, polaroid
- Rarity engine: Common, Rare, Epic, Legendary, Mythic with reveal animation and effects
- 3D tilt, click-to-flip card backs, QR codes, serials, stamps, stickers
- Live Goa weather fallback, IST clock-ready stamps, moon phase, randomized Goa HQ
- Multi-format export: high-res PNG, Twitter, square, story, WhatsApp, PDF passport; GIF uses a static capture fallback in this client-only build
- Shareable localStorage-backed URLs and demo Hall of Fame distribution chart
- Easter eggs: `susegad`, `goa`, Konami code, logo clicks, sun-icon hook

## Setup
```bash
npm install
npm run dev
```

## Build for Vercel
```bash
npm run build
```
Deploy the repository to Vercel. No server configuration is required. Optional: set `VITE_OPENWEATHER_KEY` for live Panjim weather; otherwise the mock Goa weather stamp is used.

## Notes
Face detection models load from a CDN and gracefully fall back if blocked. All card data is saved in `localStorage`, intentionally zero-backend for hackathon demo portability.

# JPG Style SmartWash

Premium automotive care e-commerce platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start frontend (port 3000)
npm run dev:web

# Start API (port 4000)
npm run dev:api

# Start both
npm run dev
```

## Project Structure

```
jpg-style-smartwash/
├── apps/
│   ├── web/      # Next.js customer store (port 3000)
│   ├── admin/    # Next.js admin panel (port 3001)
│   └── api/      # Express API (port 4000)
├── packages/
│   └── shared/   # Shared types & utils
├── docker/       # Docker configs
└── .env.example  # Environment variables template
```

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **Backend**: Express.js (MVP) → NestJS (Phase 2)
- **Database**: In-memory (MVP) → PostgreSQL 16 (Phase 2)
- **Cache**: Redis 7

## Docker

```bash
cd docker
docker-compose up -d
```

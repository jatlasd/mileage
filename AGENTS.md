# AGENTS.md

## Cursor Cloud specific instructions

### Product

Single Next.js 15 PWA (`mileage`) for delivery-driver trip/mileage tracking. Dev server: `http://localhost:3000`. See `CLAUDE.md` for architecture and routes.

### Required services

| Service | How to run |
|---------|------------|
| **MongoDB** | Not bundled in the repo. Local dev uses Docker: `mongo:7` on port `27017` (container name `mileage-mongo`). |
| **Next.js** | `npm run dev` (Turbopack) from repo root |

### MongoDB (local Docker)

Docker is not started automatically on VM boot. Before the app can talk to the database:

1. Ensure `dockerd` is running (this environment may need `sudo dockerd` in the background if the daemon is not up).
2. Start or create MongoDB:

```bash
sudo docker start mileage-mongo 2>/dev/null || \
  sudo docker run -d --name mileage-mongo -p 27017:27017 mongo:7
```

### Environment

- **`MONGODB_URI`** is required (see `lib/mongodb.js`). There is no `.env.example` in the repo.
- Create `.env` at the repo root (gitignored), e.g. `MONGODB_URI=mongodb://127.0.0.1:27017/mileage`
- Next.js loads `.env` automatically; `next.config.mjs` also exposes `MONGODB_URI` to the client bundle.

### Standard commands

From `package.json` / `CLAUDE.md`:

- **Install:** `npm install`
- **Dev:** `npm run dev`
- **Lint:** `npm run lint` (warnings only in current tree; exit 0)
- **Build:** `npm run build`
- **Prod:** `npm start` (after build)
- **Tests:** no `test` script; verify via lint, build, and manual/API or browser flows

### Gotchas

- Almost all `/api/*` routes call `connectToDb()`; without MongoDB and `MONGODB_URI`, pages may load but data actions return 500.
- Only one trip can be `isActive: true` at a time (enforced in API/UI).
- Maintenance scripts under `scripts/*.mjs` need `dotenv` and `MONGODB_URI` if run directly.
- No auth layer; no seed data—trips are created via UI or API.

### Quick API smoke test

```bash
curl -s -X POST http://localhost:3000/api/entry -H 'Content-Type: application/json' -d '{"mileage": 10000, "zone": "Swedesboro"}'
curl -s -X POST http://localhost:3000/api/entry -H 'Content-Type: application/json' -d '{"mileage": 10025}'
curl -s http://localhost:3000/api/entry
```

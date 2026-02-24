# Project Handover Guide

This document is for handing over the **Late Entry Tracker** project to a new developer or admin.

## 1. What this project is

- Frontend: React + Vite (`frontend/`)
- Backend: Node.js + Express + TypeScript (`backend/`)
- Data storage: Google Sheets

## 2. Required tools

- Node.js 20+ (`node -v`)
- npm 10+ (`npm -v`)
- Google Sheet with correct tabs and headers

## 3. First-time setup (local)

1. Clone the project.
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Create root `.env` file (or use `.env.example`) with:
   ```env
   GOOGLE_SHEET_ID="YOUR_SHEET_ID"
   GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account", ... }'
   ```
4. Run the app:
   ```bash
   npm run dev
   ```
5. Open:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/api/test-sheets`

## 4. Google Sheet structure (must match)

Create these tabs exactly:

1. `Students`
   - Headers row (A1:E1):
   - `hallticket_id`, `name`, `branch`, `section`, `year`
2. `LateLogs`
   - Headers row (A1:F1):
   - `id`, `hallticket_id`, `reason`, `timestamp`, `date`, `name`
3. `User`
   - Headers row (A1:D1):
   - `username`, `password`, `role`, `branch_access`

## 5. How to add students

Two supported methods:

1. UI import (recommended):
   - Login as `HOD`.
   - Go to **Import Data** tab.
   - Paste JSON array:
   ```json
   [
     {
       "hallticket_id": "21A91A0501",
       "name": "John Doe",
       "branch": "CSE",
       "section": "A",
       "year": 3
     }
   ]
   ```
2. Direct Google Sheet update:
   - Open `Students` tab.
   - Add rows manually after row 1 headers.

## 6. How to add user login accounts

There is no API/UI user-management screen yet. Add users directly in Google Sheet `User` tab.

Example rows:

- `admin`, `admin123`, `HOD`, `ALL`
- `teacher_cse`, `pass123`, `TEACHER`, `CSE`

Rules:

- `role` values used by app: `HOD`, `TEACHER`
- `branch_access`: specific branch (like `CSE`) or `ALL`

## 7. How to change keys / environment variables

### Local (.env)

Update root `.env`:

- `GOOGLE_SHEET_ID`: target spreadsheet ID
- `GOOGLE_SERVICE_ACCOUNT_JSON`: full service account JSON (single-line string or escaped newlines)

Then restart:

```bash
npm run dev
```

### Key rotation checklist

1. Create new key in Google Cloud service account.
2. Replace old JSON value in `.env` (local) and deployment env (cloud).
3. Verify sheet is shared with new service account email (Editor access).
4. Restart app and test `/api/test-sheets`.
5. Revoke/delete old key in Google Cloud.

## 8. Deployment options

### Option A: Render (currently documented and easiest)

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required env:
  - `GOOGLE_SHEET_ID`
  - `GOOGLE_SERVICE_ACCOUNT_JSON`
  - `NODE_ENV=production`

### Option B: Any Node host (Railway, VPS, VM, etc.)

- Same env variables as above
- Build once: `npm run build`
- Run backend in production: `npm start`
- Make sure port routing points to backend service

### Option C: Docker-based deployment

- Package backend + frontend build artifacts in one container
- Expose app port and pass the same env variables

## 9. Common issues and fixes

1. `Missing script: install:all`
   - Use updated root `package.json` with `install:all`.
2. `GOOGLE_SHEET_ID is not defined`
   - Check root `.env` exists and restart process.
3. Google Sheets 403/permission error
   - Share sheet with service account email as **Editor**.
4. Port already in use (`EADDRINUSE: 3000`)
   - Stop old node process, then restart.

## 10. Handover checklist

1. Confirm `.env` values with new owner.
2. Confirm Google Sheet access and tab structure.
3. Confirm at least one `HOD` user exists in `User` tab.
4. Run local smoke test (`npm run dev`, login, lookup, import).
5. Provide deployment dashboard access (Render or chosen host).

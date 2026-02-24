# Late Entry Tracker (Professional Full-Stack)

A robust system for tracking and analyzing campus late entries using React, Express, and Google Sheets.

## Architecture
- **Frontend**: React (Vite, Tailwind CSS, Recharts)
- **Backend**: Node.js (Express, Google Sheets API)
- **Database**: Google Sheets (used as a lightweight, accessible database)

## Quick Start (Local)

1.  **Clone and Install**:
    ```bash
    npm run install:all
    ```
2.  **Credentials**: 
    - Follow the [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) to create a Google service account key.
3.  **Environment**:
    - Create a `.env` file in the root.
    - Add `GOOGLE_SHEET_ID=your_id_here`.
    - Add `GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account", ...}'`.
4.  **Run**:
    ```bash
    npm run dev
    ```

## Cloud Deployment (Render)

1.  **Create Web Service** on Render.
2.  **Build Command**: `npm install && npm run build`
3.  **Start Command**: `npm start`
4.  **Envs**:
    - `GOOGLE_SHEET_ID`: Your sheet ID.
    - `GOOGLE_SERVICE_ACCOUNT_JSON`: Paste the entire text from `credentials.json`.
    - `NODE_ENV`: `production`

## Handover Documentation

- See [HANDOVER_GUIDE.md](./HANDOVER_GUIDE.md) for full project handover steps:
  - how to run locally
  - how to add students and users
  - how to rotate keys / update env vars
  - deployment options and troubleshooting

---
Developed with high standards for campus management.

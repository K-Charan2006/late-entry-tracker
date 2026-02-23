# Deployment Guide: GitHub & Render

Follow these steps to put your Late Entry Tracker online.

### Phase 1: GitHub Connection

I have already initialized your local Git repository and committed your files. Now you need to push them to GitHub:

1.  **Create a Repository**: Go to [GitHub](https://github.com/new) and create a new **Public** or **Private** repository named `late-entry-tracker`. Do **NOT** initialize it with a README or .gitignore.
2.  **Copy the Remote URL**: It will look like `https://github.com/your-username/late-entry-tracker.git`.
3.  **Run these commands** in your terminal here:
    ```powershell
    git remote add origin YOUR_REPOSITORY_URL
    git branch -M main
    git push -u origin main
    ```

---

### Phase 2: Render Deployment

1.  **Create Service**: Log in to [Render](https://dashboard.render.com/). Click **New +** and select **Web Service**.
2.  **Connect Repo**: Select your `late-entry-tracker` repository from GitHub.
3.  **Settings**:
    - **Language**: `Node`
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
4.  **Environment Variables**: Click the **Environment** tab and add:
    - `GOOGLE_SHEET_ID`: (Your Spreadsheet ID)
    - `GOOGLE_SERVICE_ACCOUNT_JSON`: (Copy/Paste the entire content of `backend/credentials.json`)
    - `NODE_ENV`: `production`

---

### Phase 3: Final Link
Once the build is finished, Render will give you a URL like `https://late-entry-tracker.onrender.com`. Open it, and your app will be live and connected to your Google Sheet!

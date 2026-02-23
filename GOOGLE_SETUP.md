# Google Sheets API Setup Guide

To use this application, you need to set up a Google Cloud Service Account and connect it to your Google Sheet.

### Step 1: Create a Google Cloud Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top-left and select **New Project**.
3.  Give it a name (e.g., "Late Entry Tracker") and click **Create**.

### Step 2: Enable Google Sheets API
1.  In the Cloud Console, Search for "Google Sheets API" in the top search bar.
2.  Select it and click **Enable**.

### Step 3: Create a Service Account
1.  Go to **APIs & Services > Credentials**.
2.  Click **+ CREATE CREDENTIALS** at the top and select **Service account**.
3.  Fill in the service account name and click **Create and Continue**.
4.  (Optional) Grant it the "Editor" role, then click **Done**.

### Step 4: Download the `credentials.json` Key
1.  Click on your new service account in the list.
2.  Go to the **Keys** tab.
3.  Click **ADD KEY > Create new key**.
4.  Select **JSON** and click **Create**.
5.  **Rename** the downloaded file to `credentials.json` and move it into the `backend/` folder of your project.

### Step 5: Share your Google Sheet
1.  Open the service account you just created.
2.  **Copy the Email address** (it looks like `service-account@project-id.iam.gserviceaccount.com`).
3.  Open your Google Sheet.
4.  Click the **Share** button in the top-right.
5.  Paste the service account email and grant it **Editor** access.

### Step 6: Identify your Spreadsheet ID
1.  Your Spreadsheet ID is the long string in the browser URL:
    `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`
2.  Add this ID to your `.env` file as `GOOGLE_SHEET_ID`.

### Step 7: Spreadsheet Structure
Your Google Sheet **must** have these 3 tabs (sheets) with the exact headers in the first row. Tab names are case-sensitive.

#### 1. `Students` Tab
| A: hallticket_id | B: name | C: branch | D: section | E: year |
| :--- | :--- | :--- | :--- | :--- |
| 21A91A0501 | John Doe | CSE | A | 3 |

#### 2. `LateLogs` Tab
| A: id | B: hallticket_id | C: reason | D: timestamp | E: date | F: name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *(Auto-filled)* | *(Auto-filled)* | *(Auto-filled)* | *(Auto-filled)* | *(Auto-filled)* | *(Auto-filled)* |

#### 3. `User` Tab
| A: username | B: password | C: role | D: branch_access |
| :--- | :--- | :--- | :--- |
| admin | admin123 | HOD | ALL |
| teacher1 | pass123 | TEACHER | CSE |

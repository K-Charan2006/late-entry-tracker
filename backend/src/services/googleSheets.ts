import { google } from "googleapis";
import path from "path";
import fs from "fs";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

if (!SPREADSHEET_ID) {
    console.error("CRITICAL: GOOGLE_SHEET_ID is not defined in environment variables!");
}

let auth;
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
} else {
    // Try to find credentials.json in root or backend folder
    const rootPath = path.join(process.cwd(), "credentials.json");
    const backendPath = path.join(process.cwd(), "backend", "credentials.json");
    const credPath = fs.existsSync(rootPath) ? rootPath : backendPath;

    auth = new google.auth.GoogleAuth({
        keyFile: credPath,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
}

const sheets = google.sheets({ version: "v4", auth });

export const getSheetsInfo = async () => {
    const response = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
    });
    return {
        title: response.data.properties?.title,
        sheets: response.data.sheets?.map(s => s.properties?.title)
    };
};

export const getStudentsFromSheet = async () => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Students!A2:E",
        });
        const rows = response.data.values || [];
        return rows.map((row) => ({
            hallticket_id: row[0],
            name: row[1],
            branch: row[2],
            section: row[3],
            year: parseInt(row[4], 10),
        }));
    } catch (error) {
        console.error("Error fetching students from sheet:", error);
        return [];
    }
};

export const getLogsFromSheet = async () => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "LateLogs!A2:F",
        });
        const rows = response.data.values || [];
        return rows.map((row) => ({
            id: parseInt(row[0], 10),
            hallticket_id: row[1],
            reason: row[2],
            timestamp: row[3],
            date: row[4],
            name: row[5],
        }));
    } catch (error) {
        console.error("Error fetching logs from sheet:", error);
        return [];
    }
};

export const getUsersFromSheet = async () => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "User!A2:D",
        });
        const rows = response.data.values || [];
        return rows
            .filter(row => row.length >= 2)
            .map((row) => ({
                username: row[0],
                password: row[1],
                role: row[2] || 'TEACHER',
                branch_access: row[3] || 'ALL',
            }));
    } catch (error: any) {
        console.error("Error fetching users from sheet:", error.message);
        return [];
    }
};

export const appendLateLog = async (data: any) => {
    const { id, hallticket_id, reason, timestamp, date, name } = data;
    return await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "LateLogs!A2:F",
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[id, hallticket_id, reason, timestamp, date, name]],
        },
    });
};

export const updateStudentsBatch = async (students: any[]) => {
    const values = students.map((s: any) => [
        s.hallticket_id,
        s.name,
        s.branch,
        s.section,
        s.year
    ]);

    return await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: "Students!A2:E",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
    });
};

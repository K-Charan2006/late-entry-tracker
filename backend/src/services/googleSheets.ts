import { google } from "googleapis";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const envPaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", ".env"),
];

for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
    }
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
if (!SPREADSHEET_ID) {
    throw new Error("CRITICAL: GOOGLE_SHEET_ID is required.");
}

const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!SERVICE_ACCOUNT_JSON) {
    throw new Error("CRITICAL: GOOGLE_SERVICE_ACCOUNT_JSON is required. credentials.json fallback is disabled.");
}

let credentials;
try {
    credentials = JSON.parse(SERVICE_ACCOUNT_JSON);
} catch {
    throw new Error("CRITICAL: GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
}

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
let sheetTitleMap: Map<string, string> | null = null;

const normalizeKey = (value: string) => value.trim().toLowerCase();

const getSheetTitle = async (expectedName: string) => {
    if (!sheetTitleMap) {
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        sheetTitleMap = new Map<string, string>();
        for (const sheet of metadata.data.sheets || []) {
            const title = sheet.properties?.title;
            if (title) {
                sheetTitleMap.set(normalizeKey(title), title);
            }
        }
    }

    const resolved = sheetTitleMap.get(normalizeKey(expectedName));
    return resolved || expectedName;
};

export const getSheetsInfo = async () => {
    const response = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
    });
    return {
        title: response.data.properties?.title,
        sheets: response.data.sheets?.map((s: any) => s.properties?.title)
    };
};

export const getStudentsFromSheet = async () => {
    try {
        const studentsSheet = await getSheetTitle("Students");
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${studentsSheet}'!A2:E`,
        });
        const rows = response.data.values || [];
        return rows.map((row: any[]) => ({
            hallticket_id: (row[0] || "").toString().trim().toUpperCase(),
            name: (row[1] || "").toString().trim(),
            branch: (row[2] || "").toString().trim(),
            section: (row[3] || "").toString().trim(),
            year: parseInt(row[4], 10),
        }));
    } catch (error) {
        console.error("Error fetching students from sheet:", error);
        return [];
    }
};

export const getLogsFromSheet = async () => {
    try {
        const lateLogsSheet = await getSheetTitle("LateLogs");
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${lateLogsSheet}'!A2:F`,
        });
        const rows = response.data.values || [];
        return rows.map((row: any[]) => ({
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
        const usersSheet = await getSheetTitle("User");
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${usersSheet}'!A2:D`,
        });
        const rows = response.data.values || [];
        return rows
            .filter((row: any[]) => row.length >= 2)
            .map((row: any[]) => ({
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
    const lateLogsSheet = await getSheetTitle("LateLogs");
    return await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${lateLogsSheet}'!A2:F`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [[id, hallticket_id, reason, timestamp, date, name]],
        },
    });
};

export const updateStudentsBatch = async (students: any[]) => {
    const studentsSheet = await getSheetTitle("Students");
    const values = students.map((s: any) => [
        s.hallticket_id,
        s.name,
        s.branch,
        s.section,
        s.year
    ]);

    return await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${studentsSheet}'!A2:E`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
    });
};

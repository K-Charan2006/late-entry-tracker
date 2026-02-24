import { getSheetsInfo, getStudentsFromSheet } from "./src/services/googleSheets";
import dotenv from "dotenv";
import path from "path";

// Load env from root or current folder
dotenv.config({ path: path.join(process.cwd(), "..", ".env") });
dotenv.config();

async function test() {
    console.log("--- Google Sheets Connection Diagnostic ---");
    console.log("Current Directory:", process.cwd());
    console.log("SPREADSHEET_ID:", process.env.GOOGLE_SHEET_ID || "MISSING");

    try {
        console.log("\nAttempting to fetch spreadsheet info...");
        const info = await getSheetsInfo();
        console.log("SUCCESS! Spreadsheet Title:", info.title);

        console.log("\nAttempting to fetch students...");
        const students = await getStudentsFromSheet();
        console.log(`SUCCESS! Found ${students.length} students.`);

    } catch (error: any) {
        console.error("\nFAILED TO CONNECT!");
        console.error("Error Message:", error.message);

        if (error.message.includes("404")) {
            console.log("\nCAUSE: Spreadsheet NOT FOUND. Your GOOGLE_SHEET_ID is likely incorrect.");
        } else if (error.message.includes("403")) {
            console.log("\nCAUSE: PERMISSION DENIED. Share your sheet with the service account client_email in GOOGLE_SERVICE_ACCOUNT_JSON.");
        } else if (error.message.includes("GOOGLE_SERVICE_ACCOUNT_JSON")) {
            console.log("\nCAUSE: Missing/invalid GOOGLE_SERVICE_ACCOUNT_JSON in environment variables.");
        }
    }
}

test();

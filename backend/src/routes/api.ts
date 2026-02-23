import { Router } from "express";
import * as sheetsService from "../services/googleSheets.js";

const router = Router();

router.get("/test-sheets", async (req, res) => {
    try {
        const info = await sheetsService.getSheetsInfo();
        res.json({ success: true, ...info });
    } catch (error: any) {
        console.error("Sheets Test Failed:", error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            details: "Ensure the service account email is shared with the sheet with 'Editor' access."
        });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const users = await sheetsService.getUsersFromSheet();

    const user = users.find(u =>
        u.username?.toString().trim() === username?.toString().trim() &&
        u.password?.toString().trim() === password?.toString().trim()
    );

    if (user) {
        res.json({
            username: user.username,
            role: user.role,
            branch_access: user.branch_access
        });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

router.get("/students/:id", async (req, res) => {
    const branchAccess = req.query.branch_access as string;
    const students = await sheetsService.getStudentsFromSheet();
    const student = students.find(s => s.hallticket_id === req.params.id);

    if (student) {
        if (branchAccess && branchAccess !== "ALL" && student.branch !== branchAccess) {
            return res.status(403).json({ error: "Access denied to this branch" });
        }
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

router.post("/late-logs", async (req, res) => {
    const { hallticket_id, reason, date, branch_access } = req.body;
    try {
        const students = await sheetsService.getStudentsFromSheet();
        const student = students.find(s => s.hallticket_id === hallticket_id);

        if (!student) return res.status(404).json({ error: "Student not found" });
        if (branch_access && branch_access !== "ALL" && student.branch !== branch_access) {
            return res.status(403).json({ error: "Access denied to this branch" });
        }

        const timestamp = new Date().toISOString();
        const id = Date.now();

        await sheetsService.appendLateLog({
            id,
            hallticket_id,
            reason,
            timestamp,
            date,
            name: student.name
        });

        res.json({ success: true, id });
    } catch (error) {
        console.error("Error logging entry to sheet:", error);
        res.status(500).json({ error: "Failed to log entry" });
    }
});

router.get("/analytics", async (req, res) => {
    const branchAccess = req.query.branch_access as string;
    try {
        const logs = await sheetsService.getLogsFromSheet();
        const students = await sheetsService.getStudentsFromSheet();

        const enrichedLogs = logs.map(log => {
            const student = students.find(s => s.hallticket_id === log.hallticket_id);
            return {
                ...log,
                name: student?.name || log.name,
                branch: student?.branch,
                section: student?.section,
                year: student?.year
            };
        }).filter(log => {
            if (!branchAccess || branchAccess === "ALL") return true;
            return log.branch === branchAccess;
        });

        res.json(enrichedLogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
});

router.post("/students/import", async (req, res) => {
    const students = req.body;
    try {
        await sheetsService.updateStudentsBatch(students);
        res.json({ success: true, count: students.length });
    } catch (error) {
        console.error("Error importing students to sheet:", error);
        res.status(500).json({ error: "Failed to import students" });
    }
});

export default router;

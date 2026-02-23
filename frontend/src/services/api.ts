import { Student, LateLog, User } from '../types';

export const api = {
    async testSheets() {
        const res = await fetch('/api/test-sheets');
        return res.json();
    },

    async login(credentials: any): Promise<User> {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },

    async fetchLogs(branchAccess: string): Promise<LateLog[]> {
        const res = await fetch(`/api/analytics?branch_access=${branchAccess}`);
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
    },

    async searchStudent(id: string, branchAccess: string): Promise<Student> {
        const res = await fetch(`/api/students/${id}?branch_access=${branchAccess}`);
        if (res.status === 403) throw new Error('Access denied to this branch');
        if (!res.ok) throw new Error('Student not found');
        return res.json();
    },

    async logLate(data: any) {
        const res = await fetch('/api/late-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.status === 403) throw new Error('Permission denied');
        if (!res.ok) throw new Error('Failed to log entry');
        return res.json();
    },

    async importStudents(data: any[]) {
        const res = await fetch('/api/students/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Import failed');
        return res.json();
    }
};

import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { format, isValid, parseISO } from 'date-fns';
import { LateLog, User } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

interface AnalyticsTabProps {
    logs: LateLog[];
    user: User | null;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ logs, user }) => {
    const [filters, setFilters] = useState({
        year: 'ALL',
        branch: 'ALL',
        section: 'ALL',
        rollNo: '',
        fromDate: '',
        toDate: ''
    });

    const getLogDate = (log: LateLog) => {
        if (log.date) return log.date;
        const parsedTimestamp = parseISO(log.timestamp);
        return isValid(parsedTimestamp) ? format(parsedTimestamp, 'yyyy-MM-dd') : '';
    };

    const filteredLogs = logs.filter(log => {
        const matchYear = filters.year === 'ALL' || log.year?.toString() === filters.year;
        const matchBranch = filters.branch === 'ALL' || log.branch === filters.branch;
        const matchSection = filters.section === 'ALL' || log.section === filters.section;
        const matchRoll = !filters.rollNo ||
            log.hallticket_id.toLowerCase().includes(filters.rollNo.toLowerCase()) ||
            log.name?.toLowerCase().includes(filters.rollNo.toLowerCase());

        const logDate = getLogDate(log);
        const matchFromDate = !filters.fromDate || (logDate && logDate >= filters.fromDate);
        const matchToDate = !filters.toDate || (logDate && logDate <= filters.toDate);

        return matchYear && matchBranch && matchSection && matchRoll && matchFromDate && matchToDate;
    });

    const branchData = filteredLogs.reduce((acc: any[], log) => {
        const branch = log.branch || 'Unknown';
        const existing = acc.find(d => d.name === branch);
        if (existing) existing.value++;
        else acc.push({ name: branch, value: 1 });
        return acc;
    }, []);

    const dailyData = filteredLogs.reduce((acc: any[], log) => {
        const date = log.date;
        const existing = acc.find(d => d.date === date);
        if (existing) existing.count++;
        else acc.push({ date, count: 1 });
        return acc;
    }, []).sort((a, b) => a.date.localeCompare(b.date)).slice(-7);

    const studentHistory = filters.rollNo ? filteredLogs.filter(l =>
        l.hallticket_id.toLowerCase() === filters.rollNo.toLowerCase()
    ) : [];

    const downloadPdf = () => {
        const doc = new jsPDF();
        const reportDate = format(new Date(), 'yyyy-MM-dd HH:mm');
        const todayKey = format(new Date(), 'yyyy-MM-dd');
        const uniqueStudents = new Set(filteredLogs.map(l => l.hallticket_id)).size;
        const entriesToday = filteredLogs.filter(l => getLogDate(l) === todayKey).length;

        doc.setFontSize(16);
        doc.text('Late Tracker Analytics Report', 14, 16);
        doc.setFontSize(10);
        doc.text(`Generated: ${reportDate}`, 14, 23);
        doc.text(`Total Filtered Entries: ${filteredLogs.length}`, 14, 29);
        doc.text(`Entries Today: ${entriesToday}`, 14, 35);
        doc.text(`Unique Students: ${uniqueStudents}`, 14, 41);

        const filterText = [
            `Year: ${filters.year}`,
            `Branch: ${filters.branch}`,
            `Section: ${filters.section}`,
            `Search: ${filters.rollNo || 'N/A'}`,
            `From: ${filters.fromDate || 'N/A'}`,
            `To: ${filters.toDate || 'N/A'}`
        ].join(' | ');
        doc.text(`Filters: ${filterText}`, 14, 47, { maxWidth: 180 });

        autoTable(doc, {
            startY: 54,
            head: [['Hallticket ID', 'Name', 'Branch', 'Section', 'Year', 'Reason', 'Date/Time']],
            body: filteredLogs.slice(0, 500).map(log => {
                const parsed = parseISO(log.timestamp);
                const dateTime = isValid(parsed) ? format(parsed, 'yyyy-MM-dd HH:mm') : (log.timestamp || '');
                return [
                    log.hallticket_id || '',
                    log.name || '',
                    log.branch || '',
                    log.section || '',
                    log.year?.toString() || '',
                    log.reason || '',
                    dateTime
                ];
            }),
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [15, 23, 42] },
            theme: 'striped'
        });

        doc.save(`analytics-report-${format(new Date(), 'yyyyMMdd-HHmm')}.pdf`);
    };

    return (
        <div className="space-y-8">
            {/* Advanced Filters */}
            <div className="glass-card p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Analytics Filters</h3>
                    <button
                        onClick={downloadPdf}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Year</label>
                    <select
                        value={filters.year}
                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                    >
                        <option value="ALL">All Years</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Branch</label>
                    <select
                        value={filters.branch}
                        onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                        disabled={user?.branch_access !== 'ALL'}
                    >
                        <option value="ALL">All Branches</option>
                        {Array.from(new Set(logs.map(l => l.branch))).filter(Boolean).map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Section</label>
                    <select
                        value={filters.section}
                        onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                    >
                        <option value="ALL">All Sections</option>
                        {Array.from(new Set(logs.map(l => l.section))).filter(Boolean).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Roll No / Name</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            value={filters.rollNo}
                            onChange={(e) => setFilters({ ...filters, rollNo: e.target.value })}
                            placeholder="Search roll..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">From Date</label>
                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">To Date</label>
                    <input
                        type="date"
                        value={filters.toDate}
                        min={filters.fromDate || undefined}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                    />
                </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Filtered Entries</p>
                    <p className="text-4xl font-bold">{filteredLogs.length}</p>
                </div>
                <div className="glass-card p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Entries Today</p>
                    <p className="text-4xl font-bold">
                        {filteredLogs.filter(l => l.date === format(new Date(), 'yyyy-MM-dd')).length}
                    </p>
                </div>
                <div className="glass-card p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Unique Students</p>
                    <p className="text-4xl font-bold">{new Set(filteredLogs.map(l => l.hallticket_id)).size}</p>
                </div>
            </div>

            {/* Student History Section (Visible when roll no is searched) */}
            <AnimatePresence>
                {filters.rollNo && studentHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="glass-card p-8 bg-white border border-slate-900/10 rounded-3xl shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold">Student Late History</h3>
                                <p className="text-sm text-slate-500">Showing {studentHistory.length} occurrences for {filters.rollNo}</p>
                            </div>
                            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm">
                                Total: {studentHistory.length}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="pb-4">Date & Time</th>
                                        <th className="pb-4">Reason</th>
                                        <th className="pb-4">Class Info</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {studentHistory.map(log => (
                                        <tr key={log.id} className="text-sm">
                                            <td className="py-4 font-medium">
                                                {format(parseISO(log.timestamp), 'MMM dd, yyyy')}
                                                <span className="text-slate-400 ml-2 font-normal">{format(parseISO(log.timestamp), 'HH:mm')}</span>
                                            </td>
                                            <td className="py-4 text-slate-600 italic">"{log.reason}"</td>
                                            <td className="py-4">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold mr-1">{log.branch}</span>
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">{log.year}Y - {log.section}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Branch Comparison</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={branchData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {branchData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {branchData.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-slate-600">{d.name}</span>
                                <span className="font-bold ml-auto">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Daily Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickFormatter={(val) => format(parseISO(val), 'MMM dd')}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <h3 className="text-xl font-bold mb-6">Detailed Activity Log</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="pb-4">Student</th>
                                <th className="pb-4">Branch/Class</th>
                                <th className="pb-4">Reason</th>
                                <th className="pb-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLogs.slice(0, 50).map(log => (
                                <tr key={log.id} className="text-sm hover:bg-slate-50 transition-colors">
                                    <td className="py-4">
                                        <p className="font-bold text-slate-900">{log.name}</p>
                                        <p className="text-xs font-mono text-slate-400">{log.hallticket_id}</p>
                                    </td>
                                    <td className="py-4">
                                        <p className="font-medium text-slate-700">{log.branch}</p>
                                        <p className="text-xs text-slate-400">{log.year}Y - Sec {log.section}</p>
                                    </td>
                                    <td className="py-4 text-slate-600 italic">"{log.reason}"</td>
                                    <td className="py-4 text-slate-500 font-medium">
                                        {format(parseISO(log.timestamp), 'MMM dd, HH:mm')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

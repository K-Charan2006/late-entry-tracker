import React, { useState } from 'react';
import { Search, ChevronRight, AlertCircle, FileSpreadsheet, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { Student, LateLog } from '../types';

interface LookupTabProps {
    onSearch: (id: string) => Promise<void>;
    onLogLate: (reason: string) => Promise<void>;
    student: Student | null;
    logs: LateLog[];
    loading: boolean;
}

export const LookupTab: React.FC<LookupTabProps> = ({
    onSearch,
    onLogLate,
    student,
    logs,
    loading
}) => {
    const [searchId, setSearchId] = useState('');
    const [reason, setReason] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchId);
    };

    const handleLogSubmit = () => {
        onLogLate(reason);
        setReason('');
    };

    return (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
            {/* Search Section */}
            <section className="space-y-6">
                <div className="glass-card p-4 sm:p-8 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Student Lookup</h2>
                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Hallticket Number</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    placeholder="Enter Hallticket ID (e.g. 24Q91A6728)"
                                    className="w-full pl-11 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-base sm:text-lg"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchId}
                            className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base sm:text-lg"
                        >
                            {loading ? "Searching..." : "Find Student"}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {student && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-4 sm:p-8 bg-white border border-slate-900/10 rounded-2xl sm:rounded-3xl shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">{student.name}</h3>
                                <p className="text-slate-500 font-mono text-sm sm:text-base break-all">{student.hallticket_id}</p>
                            </div>
                            <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-600 uppercase shrink-0">
                                Year {student.year}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Branch</p>
                                <p className="font-semibold">{student.branch}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Section</p>
                                <p className="font-semibold">{student.section}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Reason for Late Entry</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g. Transportation delay, Medical, etc."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all min-h-[100px] resize-none text-sm sm:text-base"
                                />
                            </div>
                            <button
                                onClick={handleLogSubmit}
                                disabled={loading || !reason}
                                className="w-full py-3 sm:py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base sm:text-lg"
                            >
                                <AlertCircle className="w-5 h-5" />
                                Mark Late Entry
                            </button>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* Recent Logs Section */}
            <section className="space-y-6">
                <div className="glass-card p-4 sm:p-8 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-sm h-full flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold">Recent Entries</h2>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">{format(new Date(), 'MMM dd, yyyy')}</span>
                            <span className="sm:hidden">{format(new Date(), 'dd MMM')}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
                        {logs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                                <FileSpreadsheet className="w-12 h-12 mb-4 opacity-20" />
                                <p>No late entries logged yet</p>
                            </div>
                        ) : (
                            logs.slice(0, 10).map((log) => (
                                <div key={log.id} className="p-3 sm:p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all group shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-bold text-slate-900 text-sm sm:text-base break-words">{log.name}</p>
                                        <p className="text-xs font-mono text-slate-400 shrink-0">{format(parseISO(log.timestamp), 'HH:mm')}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">{log.branch}</span>
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">Sec {log.section}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 italic">"{log.reason}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

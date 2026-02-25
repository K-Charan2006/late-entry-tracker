import React, { useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormProps {
    onLogin: (credentials: any) => Promise<void>;
    loading: boolean;
    message: { type: 'success' | 'error', text: string } | null;
    status: any;
    onCheckStatus: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onLogin,
    loading,
    message,
    status,
    onCheckStatus
}) => {
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(loginForm);
    };

    return (
        <div className="app-surface min-h-screen flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-block bg-slate-900 p-3 sm:p-4 rounded-2xl mb-4 shadow-xl shadow-slate-900/20">
                        <Clock className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Late Entry Tracker</h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium">Sign in to manage campus entries</p>
                </div>

                <div className="glass-card p-4 sm:p-8 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        {status && !status.success && (
                            <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm border border-amber-100 mb-4">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <AlertCircle className="w-4 h-4" />
                                    System Connection Issue
                                </div>
                                <p className="opacity-80 leading-relaxed mb-2">
                                    {status.error || 'Failed to connect to Google Sheets.'}
                                </p>
                                <button
                                    onClick={(e) => { e.preventDefault(); onCheckStatus(); }}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-amber-200/50 hover:bg-amber-200 px-2 py-1 rounded transition-colors"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        )}
                        {message && message.type === 'error' && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {message.text}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Username</label>
                            <input
                                type="text"
                                required
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Password</label>
                            <input
                                type="password"
                                required
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                placeholder="********"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>
                </div>
                <div className="text-center mt-8 space-y-2">
                    <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
                        Campus Management System v1.0
                    </p>
                </div>
            </motion.div>
        </div>
    );
};


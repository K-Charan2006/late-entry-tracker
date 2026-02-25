import React from 'react';
import { Clock, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface LayoutProps {
    user: User | null;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    children: React.ReactNode;
    tabs: any[];
}

export const Layout: React.FC<LayoutProps> = ({
    user,
    activeTab,
    setActiveTab,
    onLogout,
    children,
    tabs
}) => {
    return (
        <div className="app-surface min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white/85 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="bg-slate-900 p-2 rounded-lg shrink-0">
                        <Clock className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-base sm:text-xl tracking-tight leading-tight truncate">Late Entry Tracker</h1>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider truncate">Campus Management</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {tabs.filter(t => t.roles.includes(user?.role || '')).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeTab === tab.id
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-slate-900">{user?.username}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 p-3 sm:p-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
                {children}
            </main>

            {/* Mobile Navigation */}
            <nav className="md:hidden bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around sticky bottom-0 z-10 shadow-lg">
                {tabs.filter(t => t.roles.includes(user?.role || '')).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all min-w-0 px-2 py-1 rounded-lg",
                            activeTab === tab.id ? "text-slate-900" : "text-slate-400"
                        )}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label.split(' ')[0]}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

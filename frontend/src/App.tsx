/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, BarChart3, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';
import { User, Student, LateLog } from './types';
import { api } from './services/api';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/Layout';
import { LookupTab } from './components/LookupTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { ImportTab } from './components/ImportTab';

const TABS = [
  { id: 'lookup', label: 'Lookup & Log', icon: Search, roles: ['HOD', 'TEACHER'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['HOD'] },
  { id: 'import', label: 'Import Data', icon: UserPlus, roles: ['HOD'] },
];

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('lookup');
  const [student, setStudent] = useState<Student | null>(null);
  const [logs, setLogs] = useState<LateLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (user) fetchLogs();
    else checkStatus();
  }, [user]);

  const checkStatus = async () => {
    try {
      const data = await api.testSheets();
      setStatus(data);
    } catch (err) {
      setStatus({ success: false, error: 'Could not connect to server' });
    }
  };

  const handleLogin = async (credentials: any) => {
    setLoading(true);
    setMessage(null);
    try {
      const userData = await api.login(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid username or password' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setActiveTab('lookup');
  };

  const fetchLogs = async () => {
    try {
      const data = await api.fetchLogs(user?.branch_access || 'ALL');
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs');
    }
  };

  const handleSearch = async (id: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await api.searchStudent(id, user?.branch_access || 'ALL');
      setStudent(data);
    } catch (err: any) {
      setStudent(null);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogLate = async (reason: string) => {
    if (!student) return;
    setLoading(true);
    try {
      await api.logLate({
        hallticket_id: student.hallticket_id,
        reason,
        date: new Date().toISOString().split('T')[0],
        branch_access: user?.branch_access
      });
      setMessage({ type: 'success', text: 'Late entry logged successfully' });
      setStudent(null);
      fetchLogs();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (jsonText: string) => {
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      setLoading(true);
      await api.importStudents(data);
      setMessage({ type: 'success', text: `Imported ${data.length} students` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid JSON format or import failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        loading={loading}
        message={message}
        status={status}
        onCheckStatus={checkStatus}
        onCopyEmail={() => {
          navigator.clipboard.writeText('sheets-service-account@mrce-lateattendance-system.iam.gserviceaccount.com');
          setMessage({ type: 'success', text: 'Email copied to clipboard' });
        }}
      />
    );
  }

  return (
    <Layout
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      tabs={TABS}
    >
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm",
              message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
            )}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100 px-2 text-xl">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'lookup' && (
        <LookupTab
          onSearch={handleSearch}
          onLogLate={handleLogLate}
          student={student}
          logs={logs}
          loading={loading}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab logs={logs} user={user} />
      )}

      {activeTab === 'import' && (
        <ImportTab onImport={handleImport} loading={loading} />
      )}
    </Layout>
  );
}

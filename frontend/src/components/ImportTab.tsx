import React from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';

interface ImportTabProps {
    onImport: (data: string) => Promise<void>;
    loading: boolean;
}

export const ImportTab: React.FC<ImportTabProps> = ({ onImport, loading }) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            onImport(e.target.value);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-slate-100 p-3 rounded-xl">
                        <UserPlus className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Import Student Data</h2>
                        <p className="text-sm text-slate-500">Update your student database for the new batch</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-sm mb-2">Instructions</h4>
                        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                            <li>Prepare your student list in JSON format.</li>
                            <li>Each object must have: <code className="bg-white px-1 rounded border">hallticket_id</code>, <code className="bg-white px-1 rounded border">name</code>, <code className="bg-white px-1 rounded border">branch</code>, <code className="bg-white px-1 rounded border">section</code>, and <code className="bg-white px-1 rounded border">year</code>.</li>
                            <li>Paste the JSON array below to update the database.</li>
                        </ul>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">JSON Data</label>
                        <textarea
                            onChange={handleTextChange}
                            placeholder='[{"hallticket_id":"24Q91A6728","name":"Karumanchi Charan","branch":"CSE","section":"DS","year":2}]'
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all min-h-[300px] font-mono text-sm"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <AlertCircle className="w-4 h-4" />
                        Existing students with the same Hallticket ID will be updated.
                    </div>
                </div>
            </div>
        </div>
    );
};

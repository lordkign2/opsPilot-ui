'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Search,
  Paperclip,
  Mic,
  Send,
  Database,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  History,
  Terminal
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface LogItem {
  id: string;
  category: string;
  title: string;
  time: string;
  alert?: boolean;
}

const mockLogs: LogItem[] = [
  { id: '1', category: 'INVENTORY ANALYSIS', title: 'Q3 Stock Depletion Rates', time: 'Just now' },
  { id: '2', category: 'FINANCIAL GEN', title: 'Predictive revenue model for Nov', time: '2 hrs ago' },
  { id: '3', category: 'LOGISTICS', title: 'Route optimization summary', time: 'Yesterday' },
  { id: '4', category: 'SYSTEM ALERT', title: 'Server latency diagnostic', time: 'Oct 24', alert: true },
];

interface MatrixRow {
  sku: string;
  category: string;
  rate: number;
  depletion: string;
  critical?: boolean;
}

const depletionMatrix: MatrixRow[] = [
  { sku: '#NG-882-A', category: 'Power Units', rate: 142, depletion: 'Nov 12', critical: true },
  { sku: '#NG-104-B', category: 'Optics', rate: 89, depletion: 'Dec 05' },
  { sku: '#NG-991-X', category: 'Cooling Mods', rate: 210, depletion: 'Nov 18', critical: true },
];

export default function AIInsightsPage() {
  const [selectedLogId, setSelectedLogId] = useState('1');
  const [chatInput, setChatInput] = useState('');
  const [logsFilter, setLogsFilter] = useState('');

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.title.toLowerCase().includes(logsFilter.toLowerCase()) ||
      log.category.toLowerCase().includes(logsFilter.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
      {/* Left Pane: Command History */}
      <div className="lg:col-span-4 glass-card rounded-custom-md p-4 flex flex-col overflow-hidden">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
          <History className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Command History</h2>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={logsFilter}
            onChange={(e) => setLogsFilter(e.target.value)}
            placeholder="Filter logs..."
            className="w-full glass-input pl-9 pr-3.5 py-2 text-xs rounded-custom-sm"
          />
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredLogs.map((log) => {
            const isSelected = selectedLogId === log.id;
            return (
              <button
                key={log.id}
                onClick={() => setSelectedLogId(log.id)}
                className={`w-full p-3.5 rounded-custom-sm border text-left cursor-pointer transition-all duration-200 flex flex-col space-y-1 relative group ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(0,245,255,0.05)]'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold tracking-widest ${
                      isSelected ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {log.category}
                  </span>
                  <span className="text-[9px] text-text-muted">{log.time}</span>
                </div>
                <span className="text-xs font-semibold text-white truncate group-hover:text-primary transition-colors">
                  {log.title}
                </span>

                {log.alert && (
                  <span className="absolute bottom-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: AI Console / Chat Screen */}
      <div className="lg:col-span-8 glass-card rounded-custom-md flex flex-col overflow-hidden bg-slate-950/20">
        {/* Chat Console Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-custom-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">OpsPilot Core Online</h2>
              <span className="text-[9px] text-text-muted block mt-0.5">
                System latency: <span className="text-primary font-mono">12ms</span> | Model:{' '}
                <span className="text-text-secondary font-mono">v4-enterprise</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center bg-success/10 border border-success/20 text-success text-[9px] font-bold px-2 py-0.5 rounded-full">
              Connected
            </span>
          </div>
        </div>

        {/* Message Log Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* User Message Bubble */}
          <div className="flex justify-end items-start space-x-3">
            <div className="max-w-[75%] bg-slate-900 border border-white/5 rounded-custom-sm p-4 text-sm leading-relaxed text-text-primary">
              Analyze the current stock depletion rates for our top 5 SKUs in the Lagos warehouse over the last quarter. Highlight any projected shortfalls before the holiday season.
            </div>
          </div>

          {/* Assistant Response Bubble */}
          <div className="flex justify-start items-start space-x-3">
            <div className="w-8 h-8 min-w-[32px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="max-w-[85%] space-y-4">
              <div className="bg-slate-900/60 border border-white/5 rounded-custom-sm p-4 text-sm leading-relaxed text-text-primary space-y-4">
                <p>
                  I've analyzed the Q3 telemetry from the Lagos facility. Based on current run rates,{' '}
                  <span className="text-primary font-semibold">3 out of 5 top SKUs will reach critical depletion</span>{' '}
                  before week 48.
                </p>

                {/* Depletion Matrix Table */}
                <div className="border border-white/5 rounded-custom-sm overflow-hidden mt-4">
                  <div className="bg-slate-950/40 px-4 py-2 border-b border-white/5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                    Depletion Matrix
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-semibold">
                        <th className="px-4 py-2.5">SKU ID</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5 text-right">Run Rate/Wk</th>
                        <th className="px-4 py-2.5 text-right">Est. Depletion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depletionMatrix.map((row) => (
                        <tr key={row.sku} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                          <td className="px-4 py-2.5 font-mono text-primary">{row.sku}</td>
                          <td className="px-4 py-2.5 text-white">{row.category}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{row.rate}</td>
                          <td
                            className={`px-4 py-2.5 text-right font-semibold ${
                              row.critical ? 'text-danger' : 'text-text-secondary'
                            }`}
                          >
                            {row.depletion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Query Database action */}
                <div className="pt-2">
                  <button className="flex items-center space-x-2 border border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold px-4 py-2.5 rounded-custom-sm transition-all duration-200 cursor-pointer">
                    <Database className="w-3.5 h-3.5" />
                    <span>Query Database</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Console Area */}
        <div className="p-4 border-t border-white/5 bg-slate-900/10 space-y-3">
          <div className="flex items-center space-x-2 bg-slate-950/40 border border-white/5 p-2 rounded-custom-md">
            <button className="p-2 text-text-secondary hover:text-text-primary rounded-custom-sm hover:bg-white/5 transition-all cursor-pointer">
              <Paperclip className="w-4.5 h-4.5" />
            </button>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Issue a command to OpsPilot..."
              className="flex-1 bg-transparent border-none text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-0 px-2"
            />
            <button className="p-2 text-text-secondary hover:text-text-primary rounded-custom-sm hover:bg-white/5 transition-all cursor-pointer">
              <Mic className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 bg-primary/10 border border-primary/25 hover:bg-primary text-primary hover:text-slate-900 rounded-custom-sm shadow-[0_0_10px_rgba(0,245,255,0.05)] transition-all cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-text-muted text-center leading-relaxed flex items-center justify-center space-x-1.5">
            <span>🤖 AI generated responses may be inaccurate. Verify critical operational data.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

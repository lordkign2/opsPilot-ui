'use client';

import { useState } from 'react';
import { usePromptTemplates, useCreatePromptTemplate } from '@/hooks/useAdmin';
import { Plus, Search, Terminal, Sliders, Database, Eye, History, Code, Check, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function PromptRegistry() {
  const { data: dbPrompts, isLoading: promptsLoading, refetch } = usePromptTemplates();
  const createMutation = useCreatePromptTemplate();

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // New prompt form state
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVersion, setNewVersion] = useState('v1.0');

  // Fallback mock prompt templates if empty
  const mockPrompts = [
    {
      id: 'p1',
      name: 'sys_financial_summary',
      content: `You are a senior financial analyst AI operating within the OpsPilot platform.
Your task is to review the following JSON transaction log and generate a concise executive summary.

REQUIREMENTS:
1. Identify the total gross revenue.
2. Flag any anomalous expenditures over $5,000.
3. Categorize spending into: [Operations, Marketing, Payroll, Other].
4. Maintain a formal, objective tone.

INPUT DATA:
{{transaction_data_json}}

OUTPUT FORMAT:
Return ONLY a valid JSON object matching the 'FinancialSummarySchema'.
Do not include markdown formatting or explanatory text.`,
      description: 'Generates executive summary from raw transaction logs.',
      version: 'v2.4',
      created_at: '2026-06-08T18:00:00Z',
      updated_at: '2026-06-08T20:00:00Z',
      model: 'GPT-4o'
    },
    {
      id: 'p2',
      name: 'sys_intent_classifier',
      content: 'Classify the incoming message intent: [order_status, checkout_query, customer_support, general]',
      description: 'Routes incoming user queries to correct operational agents.',
      version: 'v1.2',
      created_at: '2026-06-07T12:00:00Z',
      updated_at: '2026-06-07T12:00:00Z',
      model: 'Claude 3.5 Haiku'
    },
    {
      id: 'p3',
      name: 'sys_fraud_detection',
      content: 'Identify potential transaction risk levels from raw logs: [low, high]',
      description: 'Analyzes patterns for anomalous activity and suspicious transaction values.',
      version: 'v3.0',
      created_at: '2026-06-05T09:00:00Z',
      updated_at: '2026-06-05T09:00:00Z',
      model: 'GPT-4 Turbo'
    },
    {
      id: 'p4',
      name: 'sys_report_gen_pdf',
      content: 'Generate PDF layout data using input transaction schemas.',
      description: 'Formats JSON data into markdown for printing compliance PDF files.',
      version: 'v1.0',
      created_at: '2026-06-01T15:00:00Z',
      updated_at: '2026-06-01T15:00:00Z',
      model: 'Llama 3 70B'
    }
  ];

  const hasData = dbPrompts && dbPrompts.length > 0;
  const promptsList = hasData 
    ? dbPrompts.map((p, idx) => ({
        id: p.id,
        name: p.name,
        content: p.content,
        description: p.description || 'Custom template registry prompt.',
        version: p.version,
        created_at: p.created_at,
        updated_at: p.updated_at,
        model: idx % 2 === 0 ? 'GPT-4o' : 'Claude 3.5 Haiku',
      }))
    : mockPrompts;

  // Active prompt selected
  const activePromptId = selectedPromptId || promptsList[0]?.id;
  const activePrompt = promptsList.find((p) => p.id === activePromptId) || promptsList[0];

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContent.trim()) return;

    try {
      await createMutation.mutateAsync({
        name: newName,
        content: newContent,
        description: newDesc,
        version: newVersion,
      });
      alert('Prompt template registered successfully.');
      setNewName('');
      setNewContent('');
      setNewDesc('');
      setShowNewModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to save prompt template.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Prompt Registry & Routing</h2>
          <p className="text-xs text-text-secondary mt-1">Manage core system prompts and LLM routing configurations.</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button className="flex items-center space-x-2 bg-slate-900 border border-white/5 px-3 py-2 rounded text-xs font-semibold text-text-secondary hover:text-white cursor-pointer transition-all">
            <History className="w-3.5 h-3.5" />
            <span>View Audit Log</span>
          </button>
          
          <Button
            onClick={() => setShowNewModal(true)}
            variant="primary"
            className="flex items-center space-x-2 py-2 text-xs font-bold shadow-[0_0_15px_rgba(0,245,255,0.05)]"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3px]" />
            <span>New Prompt</span>
          </Button>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Prompt list feed */}
        <div className="lg:col-span-5 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-4 flex flex-col justify-between max-h-[500px]">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5 select-none">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Active Prompts</span>
              <span className="bg-warning/10 border border-warning/30 text-warning text-[9px] font-bold px-2 py-0.5 rounded-full">
                {promptsList.length} Total
              </span>
            </div>

            {promptsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-warning animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
                {promptsList.map((prompt) => {
                  const isSelected = prompt.id === activePromptId;
                  return (
                    <div
                      key={prompt.id}
                      onClick={() => setSelectedPromptId(prompt.id)}
                      className={`p-3 rounded-custom-md border transition-all cursor-pointer select-none hover:bg-white/5 ${
                        isSelected 
                          ? 'bg-warning/5 border-warning/30' 
                          : 'border-white/5 bg-slate-950/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white tracking-wide">{prompt.name}</span>
                        <span className="bg-white/5 border border-white/10 text-text-muted text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">{prompt.version}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1.5 truncate leading-relaxed">{prompt.description}</p>
                      
                      <div className="flex justify-between items-center mt-3 text-[8px] text-text-muted font-bold uppercase">
                        <span>2h ago</span>
                        <span className="text-warning font-mono">{prompt.model}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Prompt Editor */}
        <div className="lg:col-span-7 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between">
          {activePrompt ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                {/* Panel Title Bar */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4.5 h-4.5 text-warning" />
                    <span className="text-xs font-bold text-white font-mono tracking-wider">{activePrompt.name}.txt</span>
                  </div>

                  <div className="flex items-center space-x-3.5 select-none">
                    <div className="flex items-center text-[10px] text-text-secondary">
                      <span className="mr-1.5 font-bold uppercase">Version:</span>
                      <select className="bg-slate-950 border border-white/5 text-white font-mono text-[9px] px-2 py-0.5 rounded cursor-pointer">
                        <option>{activePrompt.version} (Latest)</option>
                      </select>
                    </div>

                    <button className="p-1 rounded hover:bg-white/5 border border-transparent hover:border-white/5 text-text-secondary hover:text-white cursor-pointer">
                      <Code className="w-3.5 h-3.5" />
                    </button>

                    <Button variant="primary" size="sm" className="h-7 text-[9px] font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.1)]">
                      Deploy to Prod
                    </Button>
                  </div>
                </div>

                {/* Text View Canvas representing prompt content */}
                <div className="mt-4 bg-slate-950/40 border border-white/5 rounded p-4 font-mono text-[11px] leading-relaxed text-text-secondary select-text whitespace-pre-wrap overflow-y-auto max-h-[300px]">
                  {activePrompt.content.split('\n').map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-white/15 select-none text-right pr-3">{idx + 1}</span>
                      <span className="flex-1 text-white/95">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[350px] text-xs text-text-muted">
              Select a prompt template on the left to review or edit.
            </div>
          )}
        </div>
      </div>

      {/* Model Routing Configuration table */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5 select-none">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4.5 h-4.5 text-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Model Routing Configuration</h3>
          </div>
        </div>

        <div className="overflow-x-auto select-none">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-bold tracking-wider bg-slate-950/20">
                <th className="px-6 py-4">Task Intent</th>
                <th className="px-6 py-4">Primary Model</th>
                <th className="px-6 py-4">Fallback Model</th>
                <th className="px-6 py-4">Cost / 1K Tks</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { intent: 'Financial Forecast', primary: 'GPT-4o', fallback: 'Claude 3.5 Sonnet', cost: '$0.005', status: 'Active' },
                { intent: 'Summary Gen', primary: 'GPT-4o', fallback: 'GPT-4 Turbo', cost: '$0.005', status: 'Active' }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all">
                  <td className="px-6 py-4 text-primary font-bold">{row.intent}</td>
                  <td className="px-6 py-4 text-white font-semibold">{row.primary}</td>
                  <td className="px-6 py-4 text-text-secondary">{row.fallback}</td>
                  <td className="px-6 py-4 font-mono font-bold">{row.cost}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center text-[9px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider bg-success/15 border-success/30 text-success">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Prompt Modal Form */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm select-none">
          <div className="w-full max-w-[500px] glass-card rounded-custom-lg p-6 space-y-4 shadow-2xl relative border border-white/10">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Register Prompt Template</span>
              <button onClick={() => setShowNewModal(false)} className="text-text-muted hover:text-white cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleCreatePrompt} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">Template Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. sys_intent_classifier"
                  className="w-full glass-input px-3 py-2 text-xs rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Generates classifications for user inputs..."
                  className="w-full glass-input px-3 py-2 text-xs rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">Initial Version</label>
                  <input
                    type="text"
                    required
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full glass-input px-3 py-2 text-xs rounded"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">Prompt Content (System Prompt)</label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Define template system prompt content here..."
                  className="w-full glass-input px-3 py-2 text-xs rounded resize-none"
                />
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-end space-x-3.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-white/5 text-[11px] font-semibold text-text-secondary hover:text-white rounded cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={createMutation.isPending}
                  className="px-4 py-2 text-[11px] font-bold shadow-[0_0_12px_rgba(0,245,255,0.08)] cursor-pointer"
                >
                  Register Template
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

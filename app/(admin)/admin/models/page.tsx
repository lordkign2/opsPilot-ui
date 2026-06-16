'use client';

import { useState } from 'react';
import { Cpu, Settings, Sliders, Database, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ModelConfiguration() {
  const [selectedIntent, setSelectedIntent] = useState('summary_gen');
  
  // Mock configurations
  const [primaryModel, setPrimaryModel] = useState('gpt-4o');
  const [fallbackModel, setFallbackModel] = useState('gpt-4-turbo');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(2048);

  const handleSaveRouting = () => {
    alert('Model routing rules updated successfully in configuration memory.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Model Configuration</h2>
        <p className="text-xs text-text-secondary mt-1">Configure LLM routing intents, temperature parameters, and fallback configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: List of task intents */}
        <div className="lg:col-span-5 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-4 flex flex-col justify-between max-h-[500px] select-none">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Task Intents</span>
              <span className="bg-primary/10 border border-primary/30 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full">
                4 Registered
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
              {[
                { id: 'summary_gen', name: 'Summary Generation', desc: 'Used for workspace metrics summaries.', model: 'GPT-4o' },
                { id: 'financial_forecast', name: 'Financial Forecasting', desc: 'Predictive revenue calculations.', model: 'GPT-4o' },
                { id: 'chat_assistant', name: 'Chat Assistant (useAI)', desc: 'Interactions on the developer console.', model: 'Claude 3.5 Sonnet' },
                { id: 'compliance_audit', name: 'Compliance Auditing', desc: 'Detect anomalies in system logs.', model: 'GPT-4 Turbo' }
              ].map((intent) => {
                const isSelected = intent.id === selectedIntent;
                return (
                  <div
                    key={intent.id}
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`p-3 rounded-custom-md border transition-all cursor-pointer hover:bg-white/5 ${
                      isSelected 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'border-white/5 bg-slate-950/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white tracking-wide">{intent.name}</span>
                      <span className="text-primary text-[8px] font-mono font-bold uppercase">{intent.model}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">{intent.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Routing config details */}
        <div className="lg:col-span-7 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3 select-none">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4.5 h-4.5 text-primary" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Routing Parameters</span>
              </div>
              
              <span className="bg-success/15 border border-success/30 text-success text-[8px] font-extrabold px-2 py-0.5 rounded uppercase font-mono tracking-widest flex items-center">
                <span className="w-1 h-1 rounded-full bg-success mr-1.5 animate-ping" />
                Config Live
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Primary Routing Model
                </label>
                <select
                  value={primaryModel}
                  onChange={(e) => setPrimaryModel(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 text-xs rounded cursor-pointer font-semibold"
                >
                  <option value="gpt-4o">OpenAI GPT-4o (gpt-4o)</option>
                  <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="gpt-4-turbo">OpenAI GPT-4 Turbo</option>
                  <option value="llama-3-70b">Meta Llama 3 70B</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Fallback Backup Model
                </label>
                <select
                  value={fallbackModel}
                  onChange={(e) => setFallbackModel(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 text-xs rounded cursor-pointer font-semibold"
                >
                  <option value="gpt-4-turbo">OpenAI GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
                  <option value="claude-3-5-haiku">Anthropic Claude 3.5 Haiku</option>
                  <option value="llama-3-8b">Meta Llama 3 8B</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    LLM Temperature ({temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    Max Token Depth
                  </label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full glass-input px-3 py-2 text-xs rounded font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col text-[9px] font-bold text-text-secondary uppercase select-none">
              <span>Avg Token Cost: $0.005 / 1K Tokens</span>
              <span className="text-text-muted mt-0.5">Calculated using production telemetry logs</span>
            </div>
            
            <Button
              onClick={handleSaveRouting}
              variant="primary"
              className="flex items-center space-x-2 py-2 text-xs font-bold shadow-[0_0_15px_rgba(0,245,255,0.08)] cursor-pointer"
            >
              <Database className="w-4 h-4 text-slate-950" />
              <span>Save Routing Configuration</span>
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}

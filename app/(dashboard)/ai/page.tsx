'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Search,
  Paperclip,
  Mic,
  Send,
  Database,
  History,
  Loader2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface LogItem {
  id: string;
  category: string;
  title: string;
  time: string;
  prompt: string;
  alert?: boolean;
}

const mockLogs: LogItem[] = [
  { 
    id: '1', 
    category: 'INVENTORY ANALYSIS', 
    title: 'Q3 Stock Depletion Rates', 
    time: 'Just now',
    prompt: 'Analyze the current stock depletion rates for our top 5 SKUs in the Lagos warehouse over the last quarter. Highlight any projected shortfalls before the holiday season.'
  },
  { 
    id: '2', 
    category: 'FINANCIAL GEN', 
    title: 'Predictive revenue model for Nov', 
    time: '2 hrs ago',
    prompt: 'Generate a predictive revenue model for the coming month based on current transaction history. Outline key variables.'
  },
  { 
    id: '3', 
    category: 'LOGISTICS', 
    title: 'Route optimization summary', 
    time: 'Yesterday',
    prompt: 'Compile a summary of shipping route optimization metrics, including average delivery turnaround time.'
  },
  { 
    id: '4', 
    category: 'SYSTEM ALERT', 
    title: 'Server latency diagnostic', 
    time: 'Oct 24', 
    alert: true,
    prompt: 'Run a diagnostic query on system latency history and identify anomalous response times.'
  },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIInsightsPage() {
  const [selectedLogId, setSelectedLogId] = useState('1');
  const [chatInput, setChatInput] = useState('');
  const [logsFilter, setLogsFilter] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "OpsPilot Core Online. I am Antigravity, your operational AI business assistant. I am connected to real-time workspace telemetries. You can ask me to analyze inventory depletion rates, compute payment details, or forecast operations bottleneck alerts."
    }
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.title.toLowerCase().includes(logsFilter.toLowerCase()) ||
      log.category.toLowerCase().includes(logsFilter.toLowerCase())
  );

  const handleSelectLogTemplate = (log: LogItem) => {
    setSelectedLogId(log.id);
    setChatInput(log.prompt);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isStreaming) return;

    const userQuery = chatInput;
    setChatInput('');
    setIsStreaming(true);

    // Append user message and prepare empty assistant bubble
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userQuery },
      { role: 'assistant', content: '' }
    ]);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ message: userQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Readable stream context is missing on response.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Hold onto fractional line

        for (const line of lines) {
          if (!line.trim()) continue;

          // Parse Vercel AI SDK protocol messages ("0:json_string")
          if (line.startsWith('0:')) {
            try {
              const textChunk = JSON.parse(line.slice(2));
              setMessages((prev) => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx]?.role === 'assistant') {
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    content: updated[lastIdx].content + textChunk,
                  };
                }
                return updated;
              });
            } catch (err) {
              console.warn('JSON chunk parse mismatch:', line, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('AI chat connection error:', err);
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.role === 'assistant') {
          updated[lastIdx] = {
            ...updated[lastIdx],
            content: '⚠️ Failed to stream response from OpsPilot assistant. Ensure the backend FastAPI server and API keys are active.',
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
      {/* Left Pane: Command History / Prompt Templates */}
      <div className="lg:col-span-4 glass-card rounded-custom-md p-4 flex flex-col overflow-hidden">
        <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
          <History className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Command Templates</h2>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={logsFilter}
            onChange={(e) => setLogsFilter(e.target.value)}
            placeholder="Filter templates..."
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
                onClick={() => handleSelectLogTemplate(log)}
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
                Latency: <span className="text-primary font-mono">Real-time telemetry</span> | Model:{' '}
                <span className="text-text-secondary font-mono">Gemini-1.5</span>
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
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 min-w-[32px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Brain className="w-4.5 h-4.5 text-primary" />
                  </div>
                )}
                <div className={isUser ? 'max-w-[75%]' : 'max-w-[85%] space-y-4'}>
                  <div
                    className={`border border-white/5 rounded-custom-sm p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-slate-900 text-text-primary'
                        : 'bg-slate-900/60 text-text-primary'
                    }`}
                  >
                    {msg.content === '' && isStreaming && index === messages.length - 1 ? (
                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Compiling query response...</span>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Console Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-slate-900/10 space-y-3">
          <div className="flex items-center space-x-2 bg-slate-950/40 border border-white/5 p-2 rounded-custom-md">
            <button
              type="button"
              className="p-2 text-text-secondary hover:text-text-primary rounded-custom-sm hover:bg-white/5 transition-all cursor-pointer"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Issue an operational command to OpsPilot..."
              disabled={isStreaming}
              className="flex-1 bg-transparent border-none text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-0 px-2 disabled:opacity-50"
            />
            <button
              type="button"
              className="p-2 text-text-secondary hover:text-text-primary rounded-custom-sm hover:bg-white/5 transition-all cursor-pointer"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>
            <button
              type="submit"
              disabled={isStreaming || !chatInput.trim()}
              className="p-2 bg-primary/10 border border-primary/25 hover:bg-primary text-primary hover:text-slate-900 rounded-custom-sm shadow-[0_0_10px_rgba(0,245,255,0.05)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-text-muted text-center leading-relaxed flex items-center justify-center space-x-1.5">
            <span>🤖 AI responses are compiled from real-time database schemas. Verify details.</span>
          </p>
        </form>
      </div>
    </div>
  );
}

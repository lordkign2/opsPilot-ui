'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  GitBranch,
  Play,
  Share2,
  Code,
  Settings,
  History,
  Plus,
  Minus,
  Search,
  X,
  Info,
  Maximize2,
  Sliders,
  Database,
  Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  useWorkflows,
  useCreateWorkflow,
  useUpdateWorkflow,
  useDeleteWorkflow,
  useWorkflowLogs,
  WorkflowCondition,
  WorkflowAction
} from '@/hooks/useWorkflows';

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<'workflows' | 'logs'>('workflows');
  const [selectedNode, setSelectedNode] = useState<'trigger' | 'condition' | 'action'>('condition');
  
  // Canvas Zoom state
  const [zoomLevel, setZoomLevel] = useState(100);

  // Default editable state mirroring the mockup
  const [workflowName, setWorkflowName] = useState('High-Value Order Alert');
  const [isActive, setIsActive] = useState(true);
  const [targetVariable, setTargetVariable] = useState('order.total_amount');
  const [operator, setOperator] = useState<string>('gt'); // 'gt', 'eq', 'lt'
  const [thresholdValue, setThresholdValue] = useState<number>(100000);
  const [continueOnFailure, setContinueOnFailure] = useState(false);
  const [whatsappTemplate, setWhatsappTemplate] = useState('Hi {{customer.name}}, your high-value order of {{order.total_amount}} has been placed!');

  // Backend queries
  const { data: dbWorkflows, isLoading: workflowsLoading, refetch: refetchWorkflows } = useWorkflows();
  const { data: executionLogs, isLoading: logsLoading, refetch: refetchLogs } = useWorkflowLogs(0, 50);

  const createMutation = useCreateWorkflow();
  const updateMutation = useUpdateWorkflow();
  const deleteMutation = useDeleteWorkflow();

  // Selected workflow from DB if exists
  const activeDbWorkflow = dbWorkflows?.find((w) => w.name === workflowName);

  // Synchronize state if active workflow already exists in database
  useEffect(() => {
    if (activeDbWorkflow) {
      setIsActive(activeDbWorkflow.is_active);
      if (activeDbWorkflow.conditions?.[0]) {
        setTargetVariable(activeDbWorkflow.conditions[0].field);
        setOperator(activeDbWorkflow.conditions[0].operator);
        setThresholdValue(Number(activeDbWorkflow.conditions[0].value) || 100000);
      }
      if (activeDbWorkflow.actions?.[0]?.params?.message) {
        setWhatsappTemplate(activeDbWorkflow.actions[0].params.message);
      }
    }
  }, [activeDbWorkflow]);

  // Handle Save Logic button click
  const handleSaveLogic = async () => {
    const payloadConditions: WorkflowCondition[] = [
      {
        field: targetVariable,
        operator: operator,
        value: thresholdValue,
      },
    ];

    const payloadActions: WorkflowAction[] = [
      {
        type: 'send_whatsapp',
        params: {
          recipient: 'owner',
          message: whatsappTemplate,
        },
      },
    ];

    try {
      if (activeDbWorkflow) {
        // Update existing workflow
        await updateMutation.mutateAsync({
          workflowId: activeDbWorkflow.id,
          payload: {
            is_active: isActive,
            conditions: payloadConditions,
            actions: payloadActions,
          },
        });
        alert('Workflow logic updated successfully.');
      } else {
        // Create new workflow rule in database
        await createMutation.mutateAsync({
          name: workflowName,
          description: 'Automated alert generated when order exceeds threshold value.',
          trigger_type: 'order.created',
          is_active: isActive,
          conditions: payloadConditions,
          actions: payloadActions,
          log_depth: 'all',
        });
        alert('Workflow rule created in database.');
      }
      refetchWorkflows();
    } catch (err) {
      console.error(err);
      alert('Error updating rule configuration.');
    }
  };

  // Toggle active rule status
  const handleToggleActive = async () => {
    const nextActive = !isActive;
    setIsActive(nextActive);

    if (activeDbWorkflow) {
      try {
        await updateMutation.mutateAsync({
          workflowId: activeDbWorkflow.id,
          payload: { is_active: nextActive },
        });
        refetchWorkflows();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getOperatorLabel = (op: string) => {
    switch (op) {
      case 'eq': return 'Equals (=)';
      case 'lt': return 'Less Than (<)';
      case 'gt':
      default:
        return 'Greater Than (>)';
    }
  };

  const getOperatorSymbol = (op: string) => {
    switch (op) {
      case 'eq': return '=';
      case 'lt': return '<';
      case 'gt':
      default:
        return '>';
    }
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden h-full font-sans bg-[#070b15]">
      {/* 1. Workflow Sub-header / Toolbar */}
      <div className="h-14 bg-[#0b1120]/60 border-b border-white/5 px-6 flex items-center justify-between shrink-0 select-none z-20">
        <div className="flex items-center space-x-6">
          {/* Navigation Menu Tabs */}
          <nav className="flex space-x-1 bg-slate-950/40 p-0.5 rounded-custom-sm border border-white/5 text-xs text-text-secondary">
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-4 py-1.5 rounded-custom-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'workflows' ? 'bg-white/5 text-primary' : 'hover:text-white'
              }`}
            >
              Builder
            </button>
            <button
              onClick={() => {
                setActiveTab('logs');
                refetchLogs();
              }}
              className={`px-4 py-1.5 rounded-custom-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'logs' ? 'bg-white/5 text-primary' : 'hover:text-white'
              }`}
            >
              Logs
            </button>
          </nav>
        </div>

        {/* Workflow specific status and action bar */}
        {activeTab === 'workflows' && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xs font-bold text-white font-mono tracking-wide">
                {workflowName}
              </h2>
              <button
                onClick={handleToggleActive}
                className={`inline-flex items-center border text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider cursor-pointer transition-all ${
                  isActive
                    ? 'bg-success/15 border-success/35 text-success'
                    : 'bg-white/5 border-white/10 text-text-muted'
                }`}
              >
                <span className={`w-1 h-1 rounded-full mr-1.5 ${isActive ? 'bg-success animate-ping' : 'bg-text-muted'}`} />
                {isActive ? 'Active' : 'Inactive'}
              </button>
            </div>

            <div className="h-4 w-px bg-white/5" />

            <div className="flex items-center space-x-3.5">
              <button
                onClick={() => setSelectedNode('trigger')}
                className="p-1.5 hover:bg-white/5 rounded text-text-secondary hover:text-white cursor-pointer"
                title="Workflow Settings"
              >
                <Settings className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('logs');
                  refetchLogs();
                }}
                className="p-1.5 hover:bg-white/5 rounded text-text-secondary hover:text-white cursor-pointer"
                title="Execution logs history"
              >
                <History className="w-4.5 h-4.5" />
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveLogic}
                isLoading={updateMutation.isPending || createMutation.isPending}
                className="text-[11px] font-semibold border-white/10 h-8"
              >
                Save
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveLogic}
                isLoading={updateMutation.isPending || createMutation.isPending}
                className="text-[11px] font-bold h-8 shadow-[0_0_15px_rgba(0,245,255,0.1)]"
              >
                Deploy
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'workflows' ? (
            /* BUILDER VIEW */
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-stretch overflow-hidden"
            >
              {/* Left Column: Library nodes */}
              <div className="w-64 bg-[#0b1120] border-r border-white/5 p-4 flex flex-col overflow-hidden select-none shrink-0">
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Library</h3>
                  <span className="text-[10px] text-text-muted mt-0.5 block">Drag or click to add node to canvas</span>
                </div>

                <div className="relative mb-5">
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search logic..."
                    className="w-full bg-[#070b15]/60 border border-white/5 text-[11px] pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-primary/50 text-white placeholder:text-text-muted"
                  />
                </div>

                <button className="w-full py-2 bg-slate-900 border border-white/5 text-[11px] font-semibold text-text-secondary hover:text-white hover:bg-white/5 rounded-custom-sm flex items-center justify-center space-x-2 transition-all cursor-pointer mb-5">
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>New Node</span>
                </button>

                {/* Library Items */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {[
                    { name: 'Triggers', icon: Zap, active: true },
                    { name: 'Logic', icon: GitBranch },
                    { name: 'Actions', icon: Play },
                    { name: 'Connectors', icon: Share2 },
                    { name: 'Variables', icon: Code },
                  ].map((category) => (
                    <div key={category.name} className="space-y-1.5">
                      <button className={`w-full flex items-center justify-between p-2 rounded text-[11px] transition-all hover:bg-white/5 cursor-pointer font-bold ${category.active ? 'text-primary bg-primary/5' : 'text-text-secondary hover:text-text-primary'}`}>
                        <div className="flex items-center space-x-2.5">
                          <category.icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Column: Drag/Drop Interactive Grid Canvas */}
              <div className="flex-1 bg-[#070b15] relative flex flex-col justify-center items-center overflow-hidden">
                {/* Visual grid background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Canvas Flow container */}
                <div
                  className="relative flex flex-col items-center py-12 transition-all duration-300 transform"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  {/* Node 1: Trigger */}
                  <div
                    onClick={() => setSelectedNode('trigger')}
                    className={`w-64 bg-slate-950 border rounded-custom-md p-4 space-y-3 cursor-pointer shadow-lg transition-all select-none hover:scale-[1.01] ${
                      selectedNode === 'trigger'
                        ? 'border-warning shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold font-mono tracking-widest text-warning uppercase flex items-center space-x-1.5">
                        <Zap className="w-3 h-3 text-warning fill-warning/20" />
                        <span>Trigger</span>
                      </span>
                      <span className="text-text-muted text-[10px]">•••</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">New Order Placed</h4>
                      <span className="text-[10px] text-text-secondary mt-0.5 block">Listens for Webhook POS</span>
                    </div>

                    {/* Bottom connector dot */}
                    <div className="relative">
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[26px] w-3 h-3 rounded-full bg-warning border-2 border-slate-950 shadow-[0_0_8px_#F59E0B] z-10" />
                    </div>
                  </div>

                  {/* Vertically linking line 1 */}
                  <div className="w-[1.5px] h-12 bg-white/10" />

                  {/* Node 2: Condition */}
                  <div
                    onClick={() => setSelectedNode('condition')}
                    className={`w-64 bg-slate-950 border rounded-custom-md p-4 space-y-3 cursor-pointer shadow-lg transition-all select-none hover:scale-[1.01] relative ${
                      selectedNode === 'condition'
                        ? 'border-primary shadow-[0_0_15px_rgba(0,245,255,0.08)]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* Top connector dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-slate-950" />

                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold font-mono tracking-widest text-primary uppercase flex items-center space-x-1.5">
                        <GitBranch className="w-3 h-3 text-primary" />
                        <span>Condition</span>
                      </span>
                      <span className="text-text-muted text-[10px]">•••</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">If transaction:</h4>
                      <span className="inline-block mt-2 text-[9px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-mono shadow-[0_0_8px_rgba(0,245,255,0.05)]">
                        Amount {getOperatorSymbol(operator)} ₦{thresholdValue.toLocaleString()}
                      </span>
                    </div>

                    {/* Bottom connector dot */}
                    <div className="relative">
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[26px] w-3 h-3 rounded-full bg-primary border-2 border-slate-950 shadow-[0_0_8px_#00F5FF] z-10" />
                    </div>
                  </div>

                  {/* Vertically linking line 2 */}
                  <div className="w-[1.5px] h-12 bg-white/10" />

                  {/* Node 3: Action */}
                  <div
                    onClick={() => setSelectedNode('action')}
                    className={`w-64 bg-slate-950 border rounded-custom-md p-4 space-y-3 cursor-pointer shadow-lg transition-all select-none hover:scale-[1.01] relative ${
                      selectedNode === 'action'
                        ? 'border-success shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* Top connector dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-success border-2 border-slate-950" />

                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold font-mono tracking-widest text-success uppercase flex items-center space-x-1.5">
                        <Play className="w-3.5 h-3.5 text-success fill-success/20" />
                        <span>Action</span>
                      </span>
                      <span className="text-text-muted text-[10px]">•••</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Notify Owner on WhatsApp</h4>
                      <span className="inline-flex items-center text-[9px] font-bold text-success mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5" />
                        Connected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Canvas Controls */}
                <div className="absolute bottom-5 right-5 flex items-center space-x-3 bg-slate-950/80 border border-white/5 rounded-custom-sm p-1 shadow-2xl text-xs text-text-secondary select-none z-10">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
                    className="p-1.5 hover:bg-white/5 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[10px] w-12 text-center text-white">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                    className="p-1.5 hover:bg-white/5 hover:text-white rounded cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-px bg-white/10" />
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 hover:bg-white/5 hover:text-white rounded cursor-pointer transition-colors"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Node Settings Drawer */}
              <div className="w-80 bg-[#0b1120] border-l border-white/5 p-5 flex flex-col justify-between overflow-y-auto shrink-0 select-none z-10">
                <div className="space-y-6">
                  {/* Title */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-primary animate-pulse" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Node Configuration</h3>
                    </div>
                    <button
                      onClick={() => setSelectedNode('condition')}
                      className="text-text-muted hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Render Configuration Content depending on selected Node */}
                  {selectedNode === 'trigger' && (
                    <div className="space-y-4">
                      {/* Trigger Info */}
                      <div className="bg-warning/5 border border-warning/15 rounded p-3 text-xs leading-relaxed text-text-primary flex items-start space-x-2.5">
                        <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">Event Hook</p>
                          <p className="text-[10px] text-text-secondary mt-0.5">Listens dynamically to Pos webhook events generated by completed order checkouts.</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Trigger Event Type
                        </label>
                        <select className="w-full glass-input px-3 py-2 text-xs rounded" disabled>
                          <option value="order.created">New Order Placed (order.created)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedNode === 'condition' && (
                    <div className="space-y-4">
                      {/* Info Alert Box */}
                      <div className="bg-primary/5 border border-primary/15 rounded p-3 text-xs leading-relaxed text-text-primary flex items-start space-x-2.5">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">Selected Node</p>
                          <p className="text-[10px] text-text-secondary mt-0.5">Condition: Amount Evaluation</p>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Target Variable
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={targetVariable}
                            onChange={(e) => setTargetVariable(e.target.value)}
                            className="w-full glass-input pl-3 pr-10 py-2.5 text-xs rounded"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-text-muted">
                            {"{}"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Operator
                        </label>
                        <select
                          value={operator}
                          onChange={(e) => setOperator(e.target.value)}
                          className="w-full glass-input px-3.5 py-2.5 text-xs rounded cursor-pointer"
                        >
                          <option value="gt">Greater Than (&gt;)</option>
                          <option value="eq">Equals (=)</option>
                          <option value="lt">Less Than (&lt;)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Value (₦)
                        </label>
                        <input
                          type="number"
                          value={thresholdValue}
                          onChange={(e) => setThresholdValue(Number(e.target.value))}
                          className="w-full glass-input px-3.5 py-2.5 text-xs rounded font-mono"
                        />
                      </div>

                      {/* Continue on failure Toggle */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 select-none">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Continue on failure
                        </span>
                        <button
                          type="button"
                          onClick={() => setContinueOnFailure(!continueOnFailure)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            continueOnFailure ? 'bg-primary' : 'bg-slate-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                              continueOnFailure ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedNode === 'action' && (
                    <div className="space-y-4">
                      {/* Action Info */}
                      <div className="bg-success/5 border border-success/15 rounded p-3 text-xs leading-relaxed text-text-primary flex items-start space-x-2.5">
                        <Info className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">Executor Type</p>
                          <p className="text-[10px] text-text-secondary mt-0.5">Send Automated WhatsApp Message.</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                          Message Template
                        </label>
                        <textarea
                          rows={4}
                          value={whatsappTemplate}
                          onChange={(e) => setWhatsappTemplate(e.target.value)}
                          className="w-full glass-input px-3.5 py-2.5 text-xs rounded resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Button
                    variant="primary"
                    onClick={handleSaveLogic}
                    isLoading={updateMutation.isPending || createMutation.isPending}
                    className="w-full flex items-center justify-center space-x-2 py-3 text-xs font-bold shadow-[0_0_15px_rgba(0,245,255,0.08)]"
                  >
                    <Database className="w-4 h-4" />
                    <span>Save Logic</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* AUDIT EXECUTION LOGS TAB */
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 p-6 space-y-6 overflow-y-auto"
            >
              {/* Header Title */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <h2 className="text-md font-bold text-white uppercase tracking-wider">Rule Execution Logs</h2>
                  <p className="text-xs text-text-secondary mt-1">Audit trail tracking all automated trigger runs.</p>
                </div>
                <button
                  onClick={() => refetchLogs()}
                  className="px-3.5 py-2 bg-slate-900 border border-white/5 text-[10px] font-semibold text-text-secondary hover:text-white rounded hover:bg-white/5 cursor-pointer flex items-center space-x-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Refresh logs</span>
                </button>
              </div>

              {logsLoading ? (
                <div className="flex items-center justify-center min-h-[300px] glass-card rounded border border-white/5 bg-slate-900/10">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : !executionLogs || executionLogs.length === 0 ? (
                <div className="p-12 text-center text-xs text-text-muted glass-card rounded border border-white/5 bg-slate-900/10">
                  No automated execution log runs have been compiled yet.
                </div>
              ) : (
                <div className="glass-card rounded border border-white/5 bg-slate-900/10 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-semibold">
                          <th className="px-6 py-4">Log ID</th>
                          <th className="px-6 py-4">Workflow Rule</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Error / Response Details</th>
                          <th className="px-6 py-4 text-right">Executed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {executionLogs.map((log) => (
                          <tr key={log.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all">
                            <td className="px-6 py-4 font-mono text-primary font-bold">#{log.id.slice(0, 8).toUpperCase()}</td>
                            <td className="px-6 py-4 text-white font-semibold">{log.workflow_name}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center text-[9px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                                log.status === 'success'
                                  ? 'bg-success/15 border-success/30 text-success'
                                  : log.status === 'skipped'
                                  ? 'bg-white/5 border-white/10 text-text-secondary'
                                  : 'bg-danger/15 border border-danger/30 text-danger'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-text-muted max-w-[320px] truncate" title={log.error_message || 'Fulfillment evaluation successful.'}>
                              {log.error_message || '✓ Executed conditions and actions successfully.'}
                            </td>
                            <td className="px-6 py-4 text-right text-text-secondary font-mono">{new Date(log.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

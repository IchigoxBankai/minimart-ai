// MiniMart AI - Intelligent AI Store Manager Co-pilot

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Boxes, 
  Tag, 
  FileText, 
  Users, 
  Award, 
  RotateCcw,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  CornerDownLeft,
  ChevronRight,
  DollarSign,
  Mic,
  MicOff
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiStoreManager } from '../services/ai/AIStoreManager';
import { aiTools } from '../services/ai/tools';
import { AI_QUICK_ACTIONS } from '../services/ai/prompts';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AIManagerPage = ({ initialPrompt, onClearInitialPrompt, onNavigate }) => {
  const { profile, currency, products, orders, customers } = useStore();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const storeId = profile?.storeId;

  // Chat Messages State
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello ${currentUser?.displayName || 'Store Owner'}! 👋 I am your **MiniMart AI Store Manager**.\n\nI have real-time access to your store's inventory, orders, customer records, and sales velocities. How can I help you optimize operations or increase profits today?`,
      chips: [
        { label: 'Live Catalog', value: `${products.length} Products` },
        { label: 'Weekly Growth', value: '+12.4%', variant: 'success' },
        { label: 'Low Stock Alerts', value: `${products.filter(p => p.stock <= p.reorderLevel).length} items`, variant: 'warning' },
      ],
      action: null,
      followUps: [
        'Which products should I reorder right now?',
        'How is my store performing this week?',
        'Give me a high-margin promotion idea.',
        'Generate my weekly business report.',
      ],
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [pendingActionToConfirm, setPendingActionToConfirm] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // If passed an initial prompt from Dashboard/Insights
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Send message handler
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      // Simulate quick natural analytical deliberation
      const response = await aiStoreManager.processUserMessage(storeId, text, messages);

      setTimeout(() => {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.text,
          chips: response.chips,
          action: response.action,
          followUps: response.followUps || [],
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsThinking(false);
      }, 500);
    } catch (err) {
      console.error('AI Error:', err);
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I encountered an issue analyzing the store data. Please try asking again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Action Approval Flow
  const handleApproveAction = async (msgId, action) => {
    if (!action) return;

    if (action.type === 'NAVIGATE_INVENTORY') {
      onNavigate('inventory');
      return;
    }
    if (action.type === 'VIEW_REPORTS') {
      onNavigate('reports');
      return;
    }

    const res = await aiStoreManager.executeApprovedAction(storeId, action);
    if (res.success) {
      showToast(res.message, 'success');

      // Update the message action state so it shows completed
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? {
                ...m,
                action: { ...m.action, isApproved: true },
              }
            : m
        )
      );

      // AI posts confirmation follow-up
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-conf-${Date.now()}`,
            sender: 'ai',
            text: res.message,
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 400);
    }
  };

  const handleDismissAction = (msgId) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              action: { ...m.action, isDismissed: true },
            }
          : m
      )
    );
    showToast('Action dismissed', 'info');
  };

  // Live context data for sidebar
  const lowStock = products.filter((p) => p.stock <= p.reorderLevel);
  const totalRevenueThisWeek = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + (o.total || 0), 0);

  const [isListening, setIsListening] = useState(false);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice speech recognition not supported in this browser.', 'warning');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak your store question 🎙️', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1F6B4F] to-[#16523C] text-[#F2A93B] flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[#1E2521] tracking-tight flex items-center gap-2">
              AI Store Manager
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#DCEBDD] text-[#1F6B4F] uppercase tracking-wider">
                Active Co-pilot
              </span>
            </h2>
            <p className="text-xs text-[#697A71]">
              Ask questions, diagnose bottlenecks, and take action on live store data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMessages([messages[0]]);
              showToast('Conversation cleared', 'info');
            }}
            className="btn-outline text-xs font-bold px-3 py-1.5 min-h-[38px] flex items-center gap-1.5"
            title="Reset Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {AI_QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleSendMessage(action.prompt)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#FAF8F3] border border-[#E3DFD5] hover:border-[#1F6B4F]/40 text-[#1E2521] whitespace-nowrap shadow-2xs transition-all flex items-center gap-2 min-h-[40px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main 2-Column Interface (Desktop) / Stacked (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Feed & Input (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-[75vh] min-h-[500px] card overflow-hidden border-[#DCD6C8]">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isAi ? '' : 'flex-row-reverse'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs ${
                      isAi
                        ? 'bg-[#1F6B4F] text-[#F2A93B]'
                        : 'bg-[#425149] text-white'
                    }`}
                  >
                    {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-3`}>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isAi
                          ? 'bg-white border border-[#E6E1D4] text-[#1E2521] shadow-soft'
                          : 'bg-[#1F6B4F] text-white font-medium'
                      }`}
                    >
                      <div className="whitespace-pre-line prose prose-sm max-w-none text-[#1E2521]">
                        {msg.text}
                      </div>

                      {/* Chips / Stats Summary */}
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-[#F0ECE1]">
                          {msg.chips.map((chip, idx) => (
                            <span
                              key={idx}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                                chip.variant === 'danger'
                                  ? 'bg-[#FDEEED] text-[#C92A2A] border-[#F9C9C6]'
                                  : chip.variant === 'warning'
                                  ? 'bg-[#FEF6E8] text-[#B06B08] border-[#FCDDB0]'
                                  : chip.variant === 'success'
                                  ? 'bg-[#E4F5E9] text-[#156B3A] border-[#C5E9CE]'
                                  : 'bg-[#F2EFE7] text-[#1E2521] border-[#DDD7C8]'
                              }`}
                            >
                              <span className="text-[#697A71] font-normal">{chip.label}: </span>
                              {chip.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Proposal Card with Confirmation Workflow */}
                    {msg.action && (
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          msg.action.isApproved
                            ? 'bg-[#E4F5E9]/60 border-[#C5E9CE]'
                            : msg.action.isDismissed
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-gradient-to-br from-[#FEFBF4] to-white border-[#F2A93B]/60 shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-[#FEF6E8] text-[#B06B08] flex items-center justify-center flex-shrink-0 font-bold">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B06B08]">
                                AI Action Proposal
                              </span>
                              <h4 className="font-bold text-sm text-[#1E2521]">
                                {msg.action.title}
                              </h4>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-[#526259] mt-2 mb-3 leading-relaxed">
                          {msg.action.description}
                        </p>

                        {msg.action.isApproved ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#156B3A] bg-[#E4F5E9] px-3 py-2 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Action Approved & Successfully Executed</span>
                          </div>
                        ) : msg.action.isDismissed ? (
                          <div className="text-xs text-[#8A9A90] italic">
                            Action cancelled by store manager.
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-2 border-t border-[#EAE4D7]">
                            <button
                              onClick={() => handleDismissAction(msg.id)}
                              className="btn-outline text-xs py-2 px-3 flex-1"
                            >
                              {msg.action.cancelLabel || 'Cancel'}
                            </button>
                            <button
                              onClick={() => handleApproveAction(msg.id, msg.action)}
                              className="btn-primary text-xs font-bold py-2 px-4 flex-1 shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                              <span>{msg.action.approveLabel || 'Approve Action'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Follow-up Suggested Pills */}
                    {msg.followUps && msg.followUps.length > 0 && isAi && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {msg.followUps.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EAF3ED] border border-[#E3DFD5] hover:border-[#1F6B4F] text-[#425149] hover:text-[#1F6B4F] transition-all text-left"
                          >
                            {prompt} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking Shimmer Indicator */}
            {isThinking && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="w-9 h-9 rounded-xl bg-[#1F6B4F] text-[#F2A93B] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E6E1D4] text-xs font-semibold text-[#697A71] shadow-soft flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1F6B4F] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#1F6B4F] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#1F6B4F] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Analyzing store database & sales trends...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-[#FAF8F3] border-t border-[#E6E2D8]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask anything about your store... (e.g. Which products should I reorder?)"
                className="input-field bg-white text-sm"
                disabled={isThinking}
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className={`p-2.5 rounded-xl border transition-all min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-md'
                    : 'bg-white border-[#DCD6C8] text-[#1F6B4F] hover:bg-[#EAF3ED]'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input (Speak your question)'}
              >
                {isListening ? <MicOff className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="btn-primary px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1F6B4F]/20 flex-shrink-0 min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Business Context & Recommended Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Real-time Store Health Card */}
          <div className="card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#DCEBDD] text-[#1F6B4F]">
                  <Boxes className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#1E2521]">
                  Live Store Snapshot
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#156B3A] bg-[#E4F5E9] px-2 py-0.5 rounded-full">
                Synced
              </span>
            </div>

            <div className="space-y-3 my-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#697A71]">Weekly Gross Sales:</span>
                <span className="font-bold text-[#1E2521]">
                  {formatCurrency(totalRevenueThisWeek || 42800, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#697A71]">Low Stock Items:</span>
                <span className={`font-bold ${lowStock.length > 0 ? 'text-[#B06B08]' : 'text-[#156B3A]'}`}>
                  {lowStock.length} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#697A71]">Registered Customers:</span>
                <span className="font-bold text-[#1E2521]">{customers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#697A71]">Total Products:</span>
                <span className="font-bold text-[#1E2521]">{products.length}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0ECE1]">
              <button
                onClick={() => handleSendMessage('Generate my weekly business report.')}
                className="w-full btn-outline text-xs font-bold py-2 flex items-center justify-center gap-1.5 min-h-[38px]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Request Executive Report</span>
              </button>
            </div>
          </div>

          {/* Quick AI Workflow Launcher */}
          <div className="card p-5 bg-gradient-to-br from-[#FAF8F3] to-white">
            <h3 className="font-display font-bold text-sm text-[#1E2521] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F2A93B]" />
              <span>Recommended Inquiries</span>
            </h3>

            <div className="space-y-2">
              {[
                { label: 'Reorder High-Velocity Items', prompt: 'Which products should I reorder right now?' },
                { label: 'Diagnose Sales Trends', prompt: 'How is my store performing this week?' },
                { label: 'Slow-Moving Stock Strategy', prompt: 'Give me smart bundle promotion ideas to boost sales.' },
                { label: 'Re-engage Inactive Shoppers', prompt: 'Which customers haven\'t purchased recently and need re-engagement?' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="w-full p-2.5 rounded-xl bg-white hover:bg-[#EAF3ED] border border-[#E3DFD5] hover:border-[#1F6B4F] text-xs font-semibold text-[#1E2521] hover:text-[#1F6B4F] text-left transition-all flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8A9A90] group-hover:text-[#1F6B4F] group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

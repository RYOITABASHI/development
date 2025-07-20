import React, { useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, Plus, ChevronDown, Bot, HelpCircle } from 'lucide-react';
import { useConductor } from '../contexts/ConductorContext';
import { TypingMessage } from '../components/TypingMessage';
import { AIGuideSystem } from '../components/AIGuideSystem';

const ChatInterface: React.FC = () => {
  const { state, actions, createRipple } = useConductor();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [state.messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      actions.sendMessage();
    }
  };

  return (
    <div className="w-full h-full bg-black text-gray-200 flex flex-col font-mono border border-orange-600 rounded" style={{ background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.05), rgba(0, 0, 0, 0.95))' }}>
      {/* Chat Header */}
      <div className="conductor-header flex items-center justify-between px-4 py-2 border-b border-orange-600" style={{ background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(0, 0, 0, 0.9))', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-orange-600 tracking-wide" style={{ textShadow: '0 0 6px #ffa500' }}>GOKU-AI Chat</div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-orange-600">
            <MessageCircle size={12} />
            <span>{state.aiGuideMode === 'guide' ? 'AI Guide' : 'AI Chat'}</span>
          </div>
          {state.isConnected && (
            <div className="flex items-center gap-1 text-orange-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span>Connected</span>
            </div>
          )}
          <button
            onClick={actions.toggleAIGuide}
            className={`conductor-button flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              state.isAIGuideActive 
                ? 'bg-orange-600 text-white' 
                : 'border border-orange-600 text-orange-600 hover:bg-orange-600/20'
            }`}
            title="Toggle AI Guide"
          >
            <Bot size={10} />
            {state.isAIGuideActive ? 'Guide Active' : 'AI Guide'}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {state.messages.map((message) => (
          <div key={message.id} className="animate-fadeIn">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
              <span>◯</span>
              <span>{message.role === 'user' ? 'You' : 'Gemini 2.5 Flash'}</span>
              <span className="ml-auto">{message.timestamp}</span>
            </div>
            <div 
              className={`p-4 rounded-lg border text-sm leading-relaxed ${
                message.role === 'user' 
                  ? 'bg-gray-800 text-gray-200 border-orange-600 ml-8' 
                  : 'bg-gray-900 text-gray-200 border-orange-600 mr-8'
              }`}
            >
              {message.role === 'assistant' ? (
                <TypingMessage content={message.content} cost={message.cost} />
              ) : (
                <>
                  <div className="whitespace-pre-line">{message.content}</div>
                  {message.cost && (
                    <span className="inline-block mt-2 px-2 py-1 bg-orange-800 border border-orange-600 rounded text-orange-300 text-xs">
                      {message.cost}
                    </span>
                  )}
                </>
              )}
            </div>
            {message.role === 'assistant' && (
              <div className="flex gap-2 mt-2 mr-8 opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  onClick={createRipple}
                  className="relative overflow-hidden border border-orange-600 px-2 py-1 rounded text-xs text-orange-600 hover:bg-orange-600 hover:text-white transition-colors group"
                >
                  <span className="relative z-10">Copy</span>
                  <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-50 group-hover:w-full transition-all duration-500 group-hover:animate-pulse"></div>
                </button>
                <button 
                  onClick={createRipple}
                  className="relative overflow-hidden border border-orange-600 px-2 py-1 rounded text-xs text-orange-600 hover:bg-orange-600 hover:text-white transition-colors group"
                >
                  <span className="relative z-10">Add to Note</span>
                  <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-50 group-hover:w-full transition-all duration-500 group-hover:animate-pulse"></div>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area - with model selection and API cost */}
      <div className="border-t border-orange-600 p-4 bg-black">
        {/* Model selection and API cost in input area */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex bg-gray-800 rounded border border-orange-600/30">
              <button
                onClick={() => actions.setAIGuideMode('assistant')}
                className={`px-3 py-1 text-xs rounded-l transition-colors ${
                  state.aiGuideMode === 'assistant'
                    ? 'bg-orange-600 text-white'
                    : 'text-orange-400 hover:bg-orange-600/20'
                }`}
              >
                <MessageCircle size={12} className="inline mr-1" />
                Assistant
              </button>
              <button
                onClick={() => actions.setAIGuideMode('guide')}
                className={`px-3 py-1 text-xs rounded-r transition-colors ${
                  state.aiGuideMode === 'guide'
                    ? 'bg-orange-600 text-white'
                    : 'text-orange-400 hover:bg-orange-600/20'
                }`}
              >
                <Bot size={12} className="inline mr-1" />
                Guide
              </button>
            </div>
            
            {/* Model Selection (only for assistant mode) */}
            {state.aiGuideMode === 'assistant' && (
              <div className="relative">
                <button
                  onClick={actions.toggleModelSelect}
                  className="relative overflow-hidden flex items-center gap-1 px-2 py-1 border border-orange-600 rounded text-orange-600 bg-transparent hover:bg-gray-900 text-xs group"
                >
                  <span className="relative z-10">Gemini 2.5 Flash</span>
                  <ChevronDown size={12} className="relative z-10" />
                  <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-30 group-hover:w-full transition-all duration-500"></div>
                </button>
                {state.showModelSelect && (
                  <div className="absolute bottom-full left-0 mb-2 border border-orange-600 rounded bg-black py-2 min-w-48 z-20">
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-orange-300 hover:bg-gray-800"
                      onClick={() => actions.setModel('gemini-2.5-flash')}
                    >
                      Gemini 2.5 Flash
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-orange-300 hover:bg-gray-800"
                      onClick={() => actions.setModel('gemini-2.5-pro')}
                    >
                      Gemini 2.5 Pro
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            {state.aiGuideMode === 'assistant' && (
              <div className="text-orange-600">
                Total: $0.027 • 342 tokens
              </div>
            )}
            {state.aiGuideMode === 'guide' && (
              <div className="text-green-400 flex items-center gap-1">
                <HelpCircle size={12} />
                Intelligent Guidance Active
              </div>
            )}
          </div>
        </div>
        
        {/* Single input area with embedded send button */}
        <div className="relative">
          <textarea
            value={state.currentMessage}
            onChange={(e) => actions.updateMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={state.aiGuideMode === 'guide' 
              ? "Ask me for help with CONDUCTOR features, troubleshooting, or guidance..."
              : "Type your message..."
            }
            className="w-full bg-transparent text-gray-200 border border-orange-600 rounded px-3 py-2 pr-20 text-sm resize-none min-h-[100px] max-h-32 focus:outline-none focus:border-orange-400"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          />
          {/* Embedded controls in textarea */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button className="text-orange-600 hover:text-orange-400 p-1 rounded hover:bg-gray-800">
              <Plus size={14} />
            </button>
            <button className="text-orange-600 hover:text-orange-400 p-1 rounded hover:bg-gray-800">
              <Mic size={14} />
            </button>
            <button
              onClick={actions.sendMessage}
              disabled={!state.currentMessage.trim() || state.isGenerating}
              className="relative overflow-hidden text-orange-600 hover:text-orange-400 p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {state.isGenerating ? (
                <div className="animate-spin relative z-10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                </div>
              ) : (
                <Send size={14} className="relative z-10" />
              )}
              <div className="absolute inset-0 w-0 h-full bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-30 group-hover:w-full transition-all duration-300"></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* AI Guide System */}
      <AIGuideSystem 
        isActive={state.isAIGuideActive} 
        onClose={actions.toggleAIGuide}
      />
    </div>
  );
};

export default ChatInterface;
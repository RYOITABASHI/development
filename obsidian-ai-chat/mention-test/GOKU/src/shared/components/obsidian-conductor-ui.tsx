import React, { useContext, useRef, useEffect, useState } from 'react';
import { useConductor } from '../contexts/ConductorContext';
import { TypingMessage } from './TypingMessage';
import { AIGuideSystem } from './AIGuideSystem';

// Obsidian Icon Component
const ObsidianIcon: React.FC<{ iconName: string; size?: number; className?: string }> = ({ 
  iconName, size = 16, className = "" 
}) => {
  const iconRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.innerHTML = '';
      (window as any).obsidian?.setIcon(iconRef.current, iconName);
    }
  }, [iconName]);
  
  return <div ref={iconRef} className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }} />;
};

// This file now only contains the UI components.
// State logic is handled by the ConductorContext.
// Mock and Initializing components have been removed.

// ===== Main Pane Components =====
export const ConductorChatPane: React.FC = () => {
  const { state, actions, createRipple } = useConductor();
  const chatRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);

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

  // Fixed border positioning to prevent right/bottom cutoff
  const containerStyle: React.CSSProperties = {
    width: 'calc(100% - 10px)',
    height: 'calc(100vh - 10px)',
    maxHeight: 'calc(100vh - 10px)',
    backgroundColor: 'rgb(0, 0, 0)',
    color: 'rgb(229, 231, 235)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    border: '2px solid rgba(255, 165, 0, 0.8)',
    borderRadius: '0.25rem',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '5px',
    padding: '0',
    boxShadow: '0 0 10px rgba(255, 165, 0, 0.3)'
  };

  return (
    <div 
      className="w-full h-full bg-black text-gray-200 flex flex-col font-mono border border-orange-600 rounded"
      style={containerStyle}
    >
      <div 
        className="flex items-center justify-between px-4 py-2 border-b border-orange-600 bg-black"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid rgb(255, 165, 0)',
          backgroundColor: 'rgb(0, 0, 0)',
          height: '50px',
          minHeight: '50px'
        }}
      >
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="text-sm font-bold text-orange-600 tracking-wide" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'rgb(255, 165, 0)', letterSpacing: '0.025em' }}>GOKU-AI Chat</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowGuide(true)}
            className="text-orange-600 hover:text-orange-400 p-1 rounded transition-colors"
            title="AI Guide"
          >
            <ObsidianIcon iconName="bot" size={14} />
          </button>
          <div className="flex items-center gap-2 text-orange-600">
            <ObsidianIcon iconName="message-circle" size={12} />
            <span>{state.selectedModel}</span>
          </div>
          {state.isConnected && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>}
        </div>
      </div>
      <div 
        ref={chatRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          flex: '1 1 0%',
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: 'rgb(0, 0, 0)',
          minHeight: '0',
          height: 'calc(100vh - 140px)'
        }}
      >
        {state.messages.map((message) => (
          <div key={message.id} style={{ marginBottom: '1rem' }}>
            <div 
              className="flex items-center gap-2 mb-2 text-xs text-gray-400"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.75rem',
                color: 'rgb(156, 163, 175)'
              }}
            >
              <span>{message.role === 'user' ? 'You' : 'Assistant'}</span>
              <span 
                className="ml-auto"
                style={{ marginLeft: 'auto' }}
              >
                {message.timestamp}
              </span>
            </div>
            <div 
              className={`p-4 rounded-lg border text-sm ${message.role === 'user' ? 'bg-gray-800 border-orange-600 ml-8' : 'bg-gray-900 border-orange-600 mr-8'}`}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgb(255, 165, 0)',
                fontSize: '0.875rem',
                backgroundColor: message.role === 'user' ? 'rgb(31, 41, 55)' : 'rgb(17, 24, 39)',
                marginLeft: message.role === 'user' ? '2rem' : '0',
                marginRight: message.role === 'user' ? '0' : '2rem'
              }}
            >
              <TypingMessage content={message.content} cost={message.cost} />
            </div>
          </div>
        ))}
      </div>
      <div 
        className="border-t border-orange-600 p-4 bg-black"
        style={{
          borderTop: '1px solid rgb(255, 165, 0)',
          padding: '1rem',
          backgroundColor: 'rgb(0, 0, 0)'
        }}
      >
        <div className="relative" style={{ position: 'relative' }}>
          <textarea
            value={state.currentMessage}
            onChange={(e) => actions.updateMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full bg-transparent text-gray-200 border border-orange-600 rounded px-3 py-2 pr-20 text-sm resize-none"
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: 'rgb(229, 231, 235)',
              border: '1px solid rgb(255, 165, 0)',
              borderRadius: '0.25rem',
              padding: '0.5rem 5rem 0.5rem 0.75rem',
              fontSize: '0.875rem',
              resize: 'none',
              outline: 'none',
              minHeight: '40px'
            }}
          />
          <div 
            className="absolute right-2 bottom-2 flex items-center gap-1"
            style={{
              position: 'absolute',
              right: '0.5rem',
              bottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'transparent'
            }}
          >
            <button 
              className="text-orange-600 hover:text-orange-400 p-1"
              style={{ 
                color: 'rgb(255, 165, 0)', 
                padding: '0.25rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <ObsidianIcon iconName="plus" size={14} />
            </button>
            <button 
              className="text-orange-600 hover:text-orange-400 p-1"
              style={{ 
                color: 'rgb(255, 165, 0)', 
                padding: '0.25rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <ObsidianIcon iconName="mic" size={14} />
            </button>
            <button 
              onClick={actions.sendMessage} 
              disabled={!state.currentMessage.trim() || state.isGenerating} 
              className="text-orange-600 hover:text-orange-400 p-1 disabled:opacity-50"
              style={{ 
                color: 'rgb(255, 165, 0)', 
                padding: '0.25rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {state.isGenerating ? <div className="animate-spin w-3.5 h-3.5 border-2 border-transparent border-t-orange-400 rounded-full"></div> : <ObsidianIcon iconName="send" size={14} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* AI Guide System */}
      <AIGuideSystem 
        isActive={showGuide} 
        onClose={() => setShowGuide(false)} 
      />
    </div>
  );
};

// ConductorOutputPane removed - GOKU is chat-only
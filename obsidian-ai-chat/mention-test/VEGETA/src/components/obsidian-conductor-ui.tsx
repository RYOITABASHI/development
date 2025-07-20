import React, { useContext, useRef, useEffect, useState } from 'react';
import { MessageCircle, Code, Send, Mic, Plus, ChevronDown, Bot } from 'lucide-react';
import { useConductor } from '../contexts/ConductorContext';
import { TypingCode } from './TypingCode';
import { MultiProgressBars } from './MultiProgressBars';

// This file now only contains the UI components.
// State logic is handled by the ConductorContext.
// Mock and Initializing components have been removed.

// ConductorChatPane removed - VEGETA is terminal-only

export const ConductorOutputPane: React.FC = () => {
  const { state, createRipple } = useConductor();

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
    border: '2px solid rgba(99, 162, 255, 0.8)',
    borderRadius: '0.25rem',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '5px',
    padding: '0',
    boxShadow: '0 0 10px rgba(99, 162, 255, 0.5)'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid rgb(99, 162, 255)',
    backgroundColor: 'rgb(0, 0, 0)',
    height: '50px',
    minHeight: '50px'
  };

  const footerStyle: React.CSSProperties = {
    borderTop: '1px solid rgb(99, 162, 255)',
    padding: '0.75rem',
    paddingBottom: '2rem',
    backgroundColor: 'rgb(0, 0, 0)'
  };

  const buttonStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgb(99, 162, 255)',
    borderRadius: '0.25rem',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    color: 'rgb(165, 201, 255)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flex: '1 1 0%'
  };

  return (
    <div 
      className="w-full h-full bg-black text-gray-200 flex flex-col font-mono border border-blue-800 rounded"
      style={containerStyle}
    >
      <div 
        className="flex items-center justify-between px-4 py-2 border-b border-blue-800 bg-black"
        style={headerStyle}
      >
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={14} className="text-blue-800" style={{ color: 'rgb(99, 162, 255)' }} />
          <div className="text-sm font-bold text-blue-800" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'rgb(99, 162, 255)' }}>VEGETA-Terminal</div>
        </div>
      </div>
      <MultiProgressBars isActive={state.isGenerating} />
      <div 
        className="flex-1 p-4 overflow-y-auto relative"
        style={{
          flex: '1 1 0%',
          padding: '1rem',
          overflowY: 'auto',
          position: 'relative',
          backgroundColor: 'rgb(0, 0, 0)',
          minHeight: '0',
          height: 'calc(100vh - 140px)'
        }}
      >
        {state.editorContent ? <TypingCode content={state.editorContent} /> : <div className="flex items-center justify-center h-full text-gray-500">Output will appear here.</div>}
      </div>
      <div 
        className="border-t border-blue-800 p-3 bg-black"
        style={footerStyle}
      >
        <div className="flex gap-1 flex-wrap" style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {['Save', 'Copy', 'Export', 'Format', 'Clear', 'Regen'].map((action) => (
            <button 
              key={action} 
              onClick={createRipple} 
              className="relative overflow-hidden border border-blue-800 rounded px-2 py-1 text-xs text-blue-800 hover:bg-blue-800 hover:text-white transition-colors flex-1"
              style={buttonStyle}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
};
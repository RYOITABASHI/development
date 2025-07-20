import React from 'react';
import { Code } from 'lucide-react';
import { useConductor } from '../contexts/ConductorContext';
import { TypingCode } from '../components/TypingCode';
import { MultiProgressBars } from '../components/MultiProgressBars';

const CodeEditor: React.FC = () => {
  const { state, createRipple } = useConductor();

  return (
    <div className="w-full h-full bg-black text-gray-200 flex flex-col font-mono border border-blue-800 rounded" style={{ background: 'linear-gradient(135deg, rgba(99, 162, 255, 0.05), rgba(0, 0, 0, 0.95))' }}>
      {/* Output Header */}
      <div className="conductor-header flex items-center justify-between px-4 py-2 border-b border-blue-800" style={{ background: 'linear-gradient(135deg, rgba(99, 162, 255, 0.1), rgba(0, 0, 0, 0.9))', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-2">
          <Code size={14} className="text-blue-800" />
          <div className="text-sm font-bold text-blue-800">VEGETA-Terminal</div>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-gray-900 border border-blue-800 rounded px-2 py-1 text-xs text-blue-800 focus:outline-none focus:border-blue-400 focus:shadow-lg transition-all duration-300" style={{ boxShadow: 'focus:0 0 15px rgba(99, 162, 255, 0.4)' }}>
            <option value="terminal" className="bg-gray-900 text-blue-800">Terminal</option>
            <option value="log" className="bg-gray-900 text-blue-800">Log</option>
            <option value="json" className="bg-gray-900 text-blue-800">JSON</option>
          </select>
        </div>
      </div>

      {/* Generation Progress */}
      <MultiProgressBars isActive={state.isGenerating} />
      {state.isGenerating && (
        <div className="relative">
          <div 
            className="absolute top-0 left-0 w-full h-0.5 z-10"
            style={{
              background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
              animation: 'codeflow 3s linear infinite'
            }}
          />
        </div>
      )}

      {/* Output Content */}
      <div className="flex-1 p-4 overflow-y-auto relative scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {state.editorContent ? (
          <TypingCode content={state.editorContent} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Code size={48} className="mx-auto mb-4 opacity-50" />
              <div className="text-lg mb-2">Terminal</div>
              <div className="text-sm">
                Command output and execution results will appear here
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Output Controls */}
      <div className="border-t border-blue-800 p-3 bg-black">
        <div className="flex gap-1 flex-wrap">
          {['Save', 'Copy', 'Export', 'Format', 'Clear', 'Regen'].map((action) => (
            <button 
              key={action}
              onClick={createRipple}
              className="relative overflow-hidden border border-blue-800 rounded px-2 py-1 text-xs text-blue-800 hover:bg-blue-800 hover:text-white transition-colors whitespace-nowrap flex-1 min-w-0 group"
            >
              <span className="relative z-10">{action}</span>
              <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 group-hover:w-full transition-all duration-300"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
import React, { useState } from 'react';
import { Zap, Terminal, Settings, Info } from 'lucide-react';
import { cn, simulateGokuToVegeta } from '@/lib/utils';
import GOKU from './GOKU';
import VEGETA from './VEGETA';

const ConductorPanel: React.FC = () => {
  const [incomingCommands, setIncomingCommands] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [showInfo, setShowInfo] = useState(false);

  const handleGokuToVegeta = (message: string, model: string) => {
    // Simulate the communication
    const commands = simulateGokuToVegeta(message, model);
    setIncomingCommands([...commands]);
    
    // Reset after a delay to allow VEGETA to process
    setTimeout(() => {
      setIncomingCommands([]);
    }, 5000);
  };

  const toggleConnection = () => {
    setConnectionStatus(prev => prev === 'connected' ? 'disconnected' : 'connected');
  };

  return (
    <div className="h-screen bg-obsidian-bg text-obsidian-text overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-obsidian-surface border-b border-obsidian-border flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-goku-primary" />
            <Terminal className="w-6 h-6 text-vegeta-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Obsidian Plugin Development Studio</h1>
            <p className="text-xs text-gray-400">GOKU & VEGETA UI Preview</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              connectionStatus === 'connected' ? "bg-green-400" : "bg-red-400"
            )} />
            <span className="text-xs text-gray-400">
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {/* Controls */}
          <button
            onClick={toggleConnection}
            className={cn(
              "px-3 py-1 text-xs rounded transition-colors",
              connectionStatus === 'connected' 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            )}
          >
            {connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}
          </button>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-obsidian-border rounded transition-colors"
            title="Show Info"
          >
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-obsidian-surface border-b border-obsidian-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-goku-primary mb-2">🟠 GOKU Features</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Multi-model AI chat interface</li>
                <li>• Supports Gemini 2.5 Pro/Flash</li>
                <li>• Real-time typing effects</li>
                <li>• Message history</li>
                <li>• Auto-scroll to bottom</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-vegeta-primary mb-2">🔵 VEGETA Features</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Terminal-style interface</li>
                <li>• Command execution simulation</li>
                <li>• Real-time log display</li>
                <li>• Export functionality</li>
                <li>• GOKU integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">🔗 Integration</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Bi-directional communication</li>
                <li>• Shared state management</li>
                <li>• Real-time command forwarding</li>
                <li>• Synchronized logging</li>
                <li>• Status monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)] flex">
        {/* GOKU Panel - Left Side */}
        <div className="w-1/2 border-r border-obsidian-border">
          <div className="h-full relative">
            {connectionStatus === 'disconnected' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Terminal className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Connection Disabled</p>
                  <p className="text-xs text-gray-500 mt-2">Click Connect to enable GOKU</p>
                </div>
              </div>
            )}
            <GOKU 
              onSendToVegeta={connectionStatus === 'connected' ? handleGokuToVegeta : undefined} 
            />
          </div>
        </div>

        {/* VEGETA Panel - Right Side */}
        <div className="w-1/2">
          <div className="h-full relative">
            {connectionStatus === 'disconnected' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Connection Disabled</p>
                  <p className="text-xs text-gray-500 mt-2">Click Connect to enable VEGETA</p>
                </div>
              </div>
            )}
            <VEGETA 
              incomingCommands={connectionStatus === 'connected' ? incomingCommands : []} 
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-obsidian-surface/90 backdrop-blur border-t border-obsidian-border px-6 py-2">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex space-x-4">
            <span>Replit Development Environment</span>
            <span>•</span>
            <span>React 18 + TypeScript + Vite</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
          <div className="flex space-x-4">
            <span>Port: 5173</span>
            <span>•</span>
            <span>Status: {connectionStatus}</span>
            <span>•</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ConductorPanel;
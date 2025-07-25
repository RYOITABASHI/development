import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Trash2, Download, Zap } from 'lucide-react';
import { cn, formatTerminalMessage, sleep } from '@/lib/utils';

interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'system' | 'error';
  timestamp: Date;
}

interface VegetaProps {
  incomingCommands?: string[];
}

const VEGETA: React.FC<VegetaProps> = ({ incomingCommands = [] }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      content: 'VEGETA Terminal System v2.1.3 initialized',
      type: 'system',
      timestamp: new Date()
    },
    {
      id: '2',
      content: 'Ready for command execution...',
      type: 'system',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPath] = useState('~/obsidian-plugins');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  // Handle incoming commands from GOKU
  useEffect(() => {
    if (incomingCommands.length > 0) {
      executeIncomingCommands(incomingCommands);
    }
  }, [incomingCommands]);

  const executeIncomingCommands = async (commands: string[]) => {
    setIsExecuting(true);
    
    // Add system message about incoming commands
    const systemLine: TerminalLine = {
      id: Date.now().toString(),
      content: '📡 Receiving commands from GOKU...',
      type: 'system',
      timestamp: new Date()
    };
    
    setLines(prev => [...prev, systemLine]);

    // Execute each command with delay
    for (const command of commands) {
      await sleep(500);
      
      const outputLine: TerminalLine = {
        id: (Date.now() + Math.random()).toString(),
        content: command,
        type: 'output',
        timestamp: new Date()
      };
      
      setLines(prev => [...prev, outputLine]);
    }

    setIsExecuting(false);
  };

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add user input line
    const inputLine: TerminalLine = {
      id: Date.now().toString(),
      content: `${currentPath}$ ${command}`,
      type: 'input',
      timestamp: new Date()
    };

    setLines(prev => [...prev, inputLine]);
    setInputValue('');
    setIsExecuting(true);

    // Simulate command execution
    await sleep(300);

    let outputContent = '';
    let outputType: 'output' | 'error' = 'output';

    // Simulate different commands
    switch (command.toLowerCase().trim()) {
      case 'help':
        outputContent = `Available commands:
  help          - Show this help message
  ls            - List files and directories
  pwd           - Show current directory
  clear         - Clear terminal
  echo [text]   - Display text
  date          - Show current date and time
  whoami        - Show current user
  goku-status   - Check GOKU connection status`;
        break;
      
      case 'ls':
        outputContent = `total 8
drwxr-xr-x  4 user  staff   128 Jan 20 10:30 GOKU/
drwxr-xr-x  4 user  staff   128 Jan 20 10:30 VEGETA/
-rw-r--r--  1 user  staff  1024 Jan 20 10:25 README.md
-rw-r--r--  1 user  staff   512 Jan 20 10:25 package.json`;
        break;
        
      case 'pwd':
        outputContent = currentPath;
        break;
        
      case 'clear':
        setLines([]);
        setIsExecuting(false);
        return;
        
      case 'date':
        outputContent = new Date().toString();
        break;
        
      case 'whoami':
        outputContent = 'obsidian-developer';
        break;
        
      case 'goku-status':
        outputContent = `🟠 GOKU Connection Status:
├─ Status: ✅ Connected
├─ Model: Available
├─ Last Activity: ${new Date().toLocaleTimeString()}
└─ Communication: Active`;
        break;
        
      default:
        if (command.startsWith('echo ')) {
          outputContent = command.substring(5);
        } else {
          outputContent = `bash: ${command}: command not found`;
          outputType = 'error';
        }
    }

    const outputLine: TerminalLine = {
      id: (Date.now() + 1).toString(),
      content: outputContent,
      type: outputType,
      timestamp: new Date()
    };

    setLines(prev => [...prev, outputLine]);
    setIsExecuting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isExecuting) {
      executeCommand(inputValue);
    }
  };

  const clearTerminal = () => {
    setLines([
      {
        id: Date.now().toString(),
        content: 'Terminal cleared',
        type: 'system',
        timestamp: new Date()
      }
    ]);
  };

  const exportLog = () => {
    const logContent = lines.map(line => 
      `[${line.timestamp.toISOString()}] ${line.type.toUpperCase()}: ${line.content}`
    ).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vegeta-terminal-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-vegeta-dark via-indigo-950 to-black">
      {/* Header */}
      <div className="vegeta-border rounded-t-lg p-4 bg-gradient-to-r from-vegeta-primary to-vegeta-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">VEGETA Terminal</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearTerminal}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title="Clear Terminal"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={exportLog}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title="Export Log"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isExecuting ? "bg-yellow-400" : "bg-green-400"
            )} />
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 bg-black/90 font-mono text-sm"
      >
        {lines.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}
        
        {/* Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-vegeta-primary font-bold mr-2">
            {currentPath}$
          </span>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent text-white border-none outline-none font-mono"
            placeholder={isExecuting ? "Executing..." : "Enter command..."}
            disabled={isExecuting}
            autoFocus
          />
          {isExecuting && (
            <div className="ml-2 text-vegeta-primary">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
          )}
        </div>
        
        {/* Cursor */}
        {!isExecuting && (
          <div className="terminal-cursor inline-block w-2 h-4 bg-vegeta-primary opacity-75"></div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-vegeta-primary/30 bg-black/80 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <span>Lines: {lines.length}</span>
          <span>Status: {isExecuting ? "Executing" : "Ready"}</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

const TerminalLine: React.FC<{ line: TerminalLine }> = ({ line }) => {
  const getLineStyle = () => {
    switch (line.type) {
      case 'input':
        return 'text-white';
      case 'output':
        return 'text-gray-300';
      case 'system':
        return 'text-vegeta-primary';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  const getPrefix = () => {
    switch (line.type) {
      case 'system':
        return '⚡ ';
      case 'error':
        return '❌ ';
      case 'output':
        return line.content.startsWith('📡') ? '' : '→ ';
      default:
        return '';
    }
  };

  return (
    <div className={cn("mb-1 leading-relaxed", getLineStyle())}>
      <span className="text-xs text-gray-500 mr-2">
        [{line.timestamp.toLocaleTimeString()}]
      </span>
      <span className="whitespace-pre-wrap">
        {getPrefix()}{line.content}
      </span>
    </div>
  );
};

export default VEGETA;
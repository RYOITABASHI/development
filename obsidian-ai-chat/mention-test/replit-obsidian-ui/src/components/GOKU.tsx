import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Brain, Sparkles } from 'lucide-react';
import { cn, simulateGokuToVegeta } from '@/lib/utils';
import { useTypingEffect } from '@/hooks/useTypingEffect';

type SupportedModel = 'gemini-2.5-pro' | 'gemini-2.5-flash';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  model?: SupportedModel;
  timestamp: Date;
}

interface GokuProps {
  onSendToVegeta?: (message: string, model: string) => void;
}

const GOKU: React.FC<GokuProps> = ({ onSendToVegeta }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'GOKU AI Chat システムが起動しました。モデルを選択してメッセージを送信してください。',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<SupportedModel>('gemini-2.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate GOKU → VEGETA communication
    if (onSendToVegeta) {
      onSendToVegeta(inputValue, selectedModel);
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `${selectedModel} で処理中です: "${inputValue}" \n\n✨ 回答: これは${selectedModel}による応答のシミュレーションです。実際のAI機能を実装するには、APIキーとエンドポイントの設定が必要です。`,
        role: 'assistant',
        model: selectedModel,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-goku-dark via-gray-900 to-black">
      {/* Header */}
      <div className="goku-border rounded-t-lg p-4 bg-gradient-to-r from-goku-primary to-goku-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">GOKU AI Chat</h2>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as SupportedModel)}
              className="bg-black/20 text-white border border-white/30 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            </select>
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/90">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-goku-primary">
            <div className="animate-pulse">💭</div>
            <span className="text-sm animate-pulse">AI が考えています...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-goku-primary/30 bg-black/80">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力してください..."
            className="flex-1 bg-gray-800 text-white border border-goku-primary/50 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-goku-primary/50 focus:border-goku-primary"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200",
              "bg-gradient-to-r from-goku-primary to-goku-secondary text-white",
              "hover:shadow-lg hover:scale-105 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "flex items-center space-x-2"
            )}
          >
            <Send className="w-4 h-4" />
            <span>送信</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const { displayedText, isTyping } = useTypingEffect(
    message.role === 'assistant' ? message.content : '',
    30
  );

  return (
    <div className={cn(
      "flex",
      message.role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        "max-w-[80%] p-3 rounded-lg shadow-lg",
        message.role === 'user' 
          ? 'bg-gradient-to-r from-goku-primary to-goku-secondary text-white' 
          : 'bg-gray-800 text-gray-100 border border-goku-primary/30'
      )}>
        {message.role === 'assistant' && message.model && (
          <div className="flex items-center space-x-1 mb-2 text-xs text-goku-primary">
            <Sparkles className="w-3 h-3" />
            <span>{message.model}</span>
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm">
          {message.role === 'assistant' ? (
            <>
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </>
          ) : (
            message.content
          )}
        </div>
        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default GOKU;
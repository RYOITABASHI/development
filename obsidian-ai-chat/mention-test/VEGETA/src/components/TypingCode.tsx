import React from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';

interface TypingCodeProps {
  content: string;
}

export const TypingCode: React.FC<TypingCodeProps> = ({ content }) => {
  const { displayText, isTyping } = useTypingEffect(content, 20); // コードは少し早めに
  
  return (
    <div 
      className="border border-blue-800 rounded-lg bg-gray-900 p-4"
      style={{
        border: '1px solid rgb(99, 162, 255)',
        borderRadius: '0.5rem',
        backgroundColor: 'rgb(17, 24, 39)',
        padding: '1rem'
      }}
    >
      <pre 
        className="text-gray-200 whitespace-pre-wrap overflow-x-auto leading-relaxed text-sm"
        style={{
          color: 'rgb(229, 231, 235)',
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
          lineHeight: '1.625',
          fontSize: '0.875rem',
          margin: '0'
        }}
      >
        <code>
          {displayText}
          {isTyping && <span className="animate-pulse text-green-400" style={{ color: 'rgb(74, 222, 128)' }}>█</span>}
        </code>
      </pre>
    </div>
  );
};
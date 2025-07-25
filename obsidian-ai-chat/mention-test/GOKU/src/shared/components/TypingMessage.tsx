import React from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';

interface TypingMessageProps {
  content: string;
  cost?: string;
}

export const TypingMessage: React.FC<TypingMessageProps> = ({ content, cost }) => {
  const { displayText, isTyping } = useTypingEffect(content, 30);
  
  return (
    <>
      <div className="whitespace-pre-line">
        {displayText}
        {isTyping && <span className="animate-pulse text-orange-400">|</span>}
      </div>
      {cost && !isTyping && (
        <span 
          className="inline-block mt-2 px-2 py-1 bg-orange-800 border border-orange-600 rounded text-orange-300 text-xs"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: 'rgb(154, 52, 18)',
            border: '1px solid rgb(255, 165, 0)',
            borderRadius: '0.25rem',
            color: 'rgb(253, 186, 116)',
            fontSize: '0.75rem'
          }}
        >
          {cost}
        </span>
      )}
    </>
  );
};
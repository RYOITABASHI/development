import React from 'react';
import { useMultiProgressEffect } from '../hooks/useMultiProgressEffect';

interface MultiProgressBarsProps {
  isActive: boolean;
}

export const MultiProgressBars: React.FC<MultiProgressBarsProps> = ({ isActive }) => {
  const progresses = useMultiProgressEffect(isActive);

  if (!isActive) return null;

  return (
    <div 
      className="absolute top-0 left-0 w-full bg-black bg-opacity-90 p-4 border-b border-blue-800"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '1rem',
        borderBottom: '1px solid rgb(99, 162, 255)',
        zIndex: '10'
      }}
    >
      <div 
        className="text-purple-400 text-xs mb-2 flex items-center"
        style={{
          color: 'rgb(167, 139, 250)',
          fontSize: '0.75rem',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div 
          className="animate-spin mr-2"
          style={{ marginRight: '0.5rem' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        </div>
        AI Processing in progress...
      </div>
      <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {progresses.map((progress, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <span 
              className="text-xs text-gray-400 w-20"
              style={{
                fontSize: '0.75rem',
                color: 'rgb(156, 163, 175)',
                width: '5rem'
              }}
            >
              {progress.label}
            </span>
            <div 
              className="flex-1 bg-gray-800 rounded-full h-1.5"
              style={{
                flex: '1 1 0%',
                backgroundColor: 'rgb(31, 41, 55)',
                borderRadius: '9999px',
                height: '0.375rem'
              }}
            >
              <div 
                className={`h-1.5 rounded-full transition-all duration-200 ${progress.color}`}
                style={{ 
                  width: `${progress.value}%`,
                  height: '0.375rem',
                  borderRadius: '9999px',
                  transition: 'all 0.2s',
                  backgroundColor: progress.color.includes('blue') ? 'rgb(99, 162, 255)' :
                                 progress.color.includes('purple') ? 'rgb(139, 92, 246)' :
                                 progress.color.includes('green') ? 'rgb(34, 197, 94)' :
                                 'rgb(234, 179, 8)'
                }}
              ></div>
            </div>
            <span 
              className="text-xs text-purple-400 w-10"
              style={{
                fontSize: '0.75rem',
                color: 'rgb(167, 139, 250)',
                width: '2.5rem'
              }}
            >
              {Math.round(progress.value)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
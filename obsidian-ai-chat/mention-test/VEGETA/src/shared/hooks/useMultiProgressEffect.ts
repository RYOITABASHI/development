import { useState, useEffect } from 'react';

interface Progress {
  label: string;
  value: number;
  color: string;
}

export const useMultiProgressEffect = (isActive: boolean) => {
  const [progresses, setProgresses] = useState<Progress[]>([
    { label: 'Parsing...', value: 0, color: 'bg-blue-500' },
    { label: 'Generating...', value: 0, color: 'bg-blue-700' },
    { label: 'Optimizing...', value: 0, color: 'bg-green-500' },
    { label: 'Finalizing...', value: 0, color: 'bg-yellow-500' }
  ]);

  useEffect(() => {
    if (!isActive) {
      setProgresses(prev => prev.map(p => ({ ...p, value: 0 })));
      return;
    }

    const intervals = progresses.map((_, index) => {
      return setInterval(() => {
        setProgresses(prev => prev.map((progress, i) => {
          if (i === index) {
            const increment = Math.random() * 15 + 5; // 5-20%ずつランダム増加
            return { ...progress, value: Math.min(progress.value + increment, 100) };
          }
          return progress;
        }));
      }, 200 + index * 100); // 各バーで微妙に異なる速度
    });

    return () => intervals.forEach(clearInterval);
  }, [isActive]);

  return progresses;
};
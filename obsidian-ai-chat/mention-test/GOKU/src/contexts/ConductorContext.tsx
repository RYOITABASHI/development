import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of a message
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cost?: string;
}

// Define the shape of the shared state
export interface ConductorState {
  messages: Message[];
  currentMessage: string;
  editorContent: string;
  isGenerating: boolean;
  selectedModel: string;
  showModelSelect: boolean;
  isConnected: boolean;
}

// Define the shape of the actions
interface ConductorActions {
    updateMessage: (message: string) => void;
    sendMessage: () => void;
    setModel: (model: string) => void;
    toggleModelSelect: () => void;
    createRipple: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Define the context value shape
interface ConductorContextType {
    state: ConductorState;
    actions: ConductorActions;
    createRipple: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setState: React.Dispatch<React.SetStateAction<ConductorState>>;
}

// Create the context
const ConductorContext = createContext<ConductorContextType | null>(null);

// This is the core state and logic that will be shared.
// It's defined outside the component to act as a singleton.
let stateListeners: React.Dispatch<React.SetStateAction<ConductorState>>[] = [];
let sharedState: ConductorState = {
    messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Welcome to the integrated Conductor plugin. Chat here and see the results on the right.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cost: '$0.004'
        }
    ],
    currentMessage: '',
    editorContent: '// Generated code will appear here.',
    isGenerating: false,
    selectedModel: 'gemini-2.5-flash',
    showModelSelect: false,
    isConnected: true
};

const setState = (newState: ConductorState | ((prevState: ConductorState) => ConductorState)) => {
    if (typeof newState === 'function') {
        sharedState = newState(sharedState);
    } else {
        sharedState = newState;
    }
    stateListeners.forEach(listener => listener(sharedState));
};

const actions: ConductorActions = {
    updateMessage: (message: string) => {
        setState(prev => ({ ...prev, currentMessage: message }));
    },
    sendMessage: () => {
        if (!sharedState.currentMessage.trim() || sharedState.isGenerating) return;
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: sharedState.currentMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, userMessage],
          currentMessage: '',
          isGenerating: true,
        }));
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'This is a simulated response, demonstrating the UI.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cost: '$0.015'
          };
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, aiResponse],
            isGenerating: false,
            editorContent: `// Response generated at ${new Date().toLocaleTimeString()}\nconsole.log("Hello, Conductor!");`
          }));
        }, 2000);
    },
    setModel: (model: string) => {
        setState(prev => ({ ...prev, selectedModel: model, showModelSelect: false }));
    },
    toggleModelSelect: () => {
        setState(prev => ({ ...prev, showModelSelect: !prev.showModelSelect }));
    },
    createRipple: (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const circle = document.createElement('span');
        
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
};

// The provider component that will wrap our views
export const ConductorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localState, setLocalState] = useState(sharedState);

  useEffect(() => {
    stateListeners.push(setLocalState);
    return () => {
      stateListeners = stateListeners.filter(listener => listener !== setLocalState);
    };
  }, []);

  return (
    <ConductorContext.Provider value={{ state: localState, actions, createRipple: actions.createRipple, setState }}>
      {children}
    </ConductorContext.Provider>
  );
};

// Custom hook to easily access the context
export const useConductor = () => {
  const context = useContext(ConductorContext);
  if (!context) {
    throw new Error('useConductor must be used within a ConductorProvider');
  }
  
  return context;
};

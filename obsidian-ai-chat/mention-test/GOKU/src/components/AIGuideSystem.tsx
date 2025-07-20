import React, { useState, useEffect } from 'react';
import { Bot, Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useConductor } from '../contexts/ConductorContext';
import { TypingMessage } from './TypingMessage';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  completed?: boolean;
}

interface GuideScenario {
  id: string;
  trigger: string;
  title: string;
  description: string;
  steps: GuideStep[];
  priority: 'low' | 'medium' | 'high';
}

const guideScenarios: GuideScenario[] = [
  {
    id: 'getting-started',
    trigger: 'first-time',
    title: 'Welcome to CONDUCTOR v2.1.3',
    description: 'Let me guide you through the enhanced features and help you get started.',
    priority: 'high',
    steps: [
      {
        id: 'step-1',
        title: 'Dual-Pane Setup',
        description: 'Use Ctrl+P → "Activate CONDUCTOR Dual-Pane Mode" for the optimal workflow',
        action: 'Open Command Palette and search for "Activate CONDUCTOR Dual-Pane Mode"'
      },
      {
        id: 'step-2',
        title: 'Chat Interface',
        description: 'The left pane is your chat interface with AI. Try typing a message!',
        action: 'Type a question or request in the chat input area'
      },
      {
        id: 'step-3',
        title: 'Output Viewer',
        description: 'The right pane shows generated code and outputs with syntax highlighting',
        action: 'Generated content will appear here automatically'
      }
    ]
  },
  {
    id: 'troubleshooting',
    trigger: 'error-detected',
    title: 'Troubleshooting Assistant',
    description: 'I detected an issue. Let me help you resolve it step by step.',
    priority: 'high',
    steps: [
      {
        id: 'error-1',
        title: 'Check Plugin Status',
        description: 'Ensure CONDUCTOR plugin is enabled in Obsidian settings',
        action: 'Go to Settings → Community Plugins → Check if CONDUCTOR is enabled'
      },
      {
        id: 'error-2',
        title: 'Restart Views',
        description: 'Close and reopen the CONDUCTOR views to refresh the interface',
        action: 'Use Ctrl+P → "Activate CONDUCTOR Dual-Pane Mode" to restart'
      },
      {
        id: 'error-3',
        title: 'Check Console',
        description: 'Open Developer Tools to see detailed error information',
        action: 'Press Ctrl+Shift+I and check the Console tab for errors'
      }
    ]
  },
  {
    id: 'optimization',
    trigger: 'performance',
    title: 'Performance Optimization',
    description: 'Optimize your CONDUCTOR experience for better performance.',
    priority: 'medium',
    steps: [
      {
        id: 'perf-1',
        title: 'Adjust Animation Settings',
        description: 'Reduce animations if experiencing lag on older devices',
        action: 'Consider reducing typing effect speed or disabling some animations'
      },
      {
        id: 'perf-2',
        title: 'Memory Management',
        description: 'Clear chat history periodically to maintain performance',
        action: 'Use the Clear button in the output pane controls'
      }
    ]
  },
  {
    id: 'features',
    trigger: 'feature-discovery',
    title: 'Discover Enhanced Features',
    description: 'Explore the new capabilities of CONDUCTOR v2.1.3.',
    priority: 'low',
    steps: [
      {
        id: 'feat-1',
        title: 'Typing Effects',
        description: 'AI responses now display with realistic typing animations',
        action: 'Send a message to see the typing effect in action'
      },
      {
        id: 'feat-2',
        title: 'Progress Indicators',
        description: 'Multi-stage progress bars show AI processing status',
        action: 'Watch the progress bars during AI response generation'
      },
      {
        id: 'feat-3',
        title: 'Interactive Buttons',
        description: 'Buttons now have ripple effects and enhanced visual feedback',
        action: 'Click any button to see the ripple effect'
      }
    ]
  }
];

interface AIGuideSystemProps {
  isActive: boolean;
  onClose: () => void;
}

export const AIGuideSystem: React.FC<AIGuideSystemProps> = ({ isActive, onClose }) => {
  const { state } = useConductor();
  const [currentScenario, setCurrentScenario] = useState<GuideScenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isActive && !currentScenario) {
      // Auto-select appropriate scenario based on context
      const scenario = state.messages.length === 1 
        ? guideScenarios.find(s => s.id === 'getting-started')
        : guideScenarios.find(s => s.id === 'features');
      
      if (scenario) {
        setCurrentScenario(scenario);
      }
    }
  }, [isActive, state.messages.length]);

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (currentScenario && currentStepIndex < currentScenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleScenarioSelect = (scenario: GuideScenario) => {
    setCurrentScenario(scenario);
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
  };

  if (!isActive) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="ai-guide-indicator animate-pulse"
        >
          <Bot size={16} />
          AI Guide Active
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="ai-guide-bubble max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-orange-600/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-full">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-400">🤖 AI Guide</h3>
              <p className="text-xs text-gray-400">Intelligent assistance for CONDUCTOR</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
              title="Minimize"
            >
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!currentScenario ? (
            /* Scenario Selection */
            <div className="p-4">
              <h4 className="text-purple-400 font-semibold mb-4">How can I help you today?</h4>
              <div className="space-y-3">
                {guideScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioSelect(scenario)}
                    className="w-full text-left p-3 rounded-lg border border-orange-600/30 bg-black/60 hover:bg-orange-600/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded ${
                        scenario.priority === 'high' ? 'bg-red-600' :
                        scenario.priority === 'medium' ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }`}>
                        {scenario.id === 'getting-started' && <Lightbulb size={12} />}
                        {scenario.id === 'troubleshooting' && <AlertTriangle size={12} />}
                        {scenario.id === 'optimization' && <CheckCircle size={12} />}
                        {scenario.id === 'features' && <Bot size={12} />}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-200">{scenario.title}</h5>
                        <p className="text-sm text-gray-400">{scenario.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Guidance */
            <div className="p-4">
              {/* Scenario Header */}
              <div className="mb-6">
                <h4 className="text-purple-400 font-semibold text-lg mb-2">{currentScenario.title}</h4>
                <TypingMessage content={currentScenario.description} />
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{completedSteps.size} / {currentScenario.steps.length}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-600 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.size / currentScenario.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Step */}
              <div className="guidance-step mb-4">
                <div className="guidance-step-number">
                  {currentStepIndex + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-200 mb-2">
                    {currentScenario.steps[currentStepIndex] && currentScenario.steps[currentStepIndex].title}
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    {currentScenario.steps[currentStepIndex] && currentScenario.steps[currentStepIndex].description}
                  </p>
                  {currentScenario.steps[currentStepIndex] && currentScenario.steps[currentStepIndex].action && (
                    <div className="bg-orange-600/20 border border-orange-600/30 rounded p-3 mb-3">
                      <p className="text-sm text-purple-300">
                        <strong>Action:</strong> {currentScenario.steps[currentStepIndex].action}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => handleStepComplete(currentScenario.steps[currentStepIndex].id)}
                    disabled={completedSteps.has(currentScenario.steps[currentStepIndex].id)}
                    className="conductor-button border border-orange-600 px-4 py-2 rounded text-orange-600 hover:bg-orange-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {completedSteps.has(currentScenario.steps[currentStepIndex].id) ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle size={16} /> Completed
                      </span>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                </div>
              </div>

              {/* All Steps Overview */}
              <div className="border-t border-orange-600/30 pt-4">
                <h5 className="text-sm font-semibold text-gray-300 mb-3">All Steps:</h5>
                <div className="space-y-2">
                  {currentScenario.steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-3 p-2 rounded ${
                        index === currentStepIndex ? 'bg-orange-600/20' : 'bg-transparent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        completedSteps.has(step.id) 
                          ? 'bg-green-600 text-white' 
                          : index === currentStepIndex
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-700 text-gray-400'
                      }`}>
                        {completedSteps.has(step.id) ? '✓' : index + 1}
                      </div>
                      <span className={`text-sm ${
                        completedSteps.has(step.id) 
                          ? 'text-green-400 line-through' 
                          : index === currentStepIndex
                            ? 'text-purple-400 font-medium'
                            : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-orange-600/30 p-4">
          <div className="flex justify-between items-center">
            {currentScenario && (
              <button
                onClick={() => setCurrentScenario(null)}
                className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                ← Back to scenarios
              </button>
            )}
            <div className="text-xs text-gray-500">
              CONDUCTOR v2.1.3 AI Guide System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGuideSystem;
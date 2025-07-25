import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Simulate API communication between GOKU and VEGETA
export const simulateGokuToVegeta = (message: string, model: string) => {
  console.log(`🟠 GOKU → VEGETA Communication:`);
  console.log(`   Model: ${model}`);
  console.log(`   Message: ${message}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  
  // Simulate terminal command execution
  const simulatedCommands = [
    `> Processing with ${model}...`,
    `> Analyzing: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
    `> Execution started`,
    `> Status: Success ✓`,
    `> Output: Command processed successfully`
  ];
  
  return simulatedCommands;
};

// Format messages for terminal display
export const formatTerminalMessage = (text: string): string => {
  const timestamp = new Date().toLocaleTimeString();
  return `[${timestamp}] ${text}`;
};

// Simulate typing effect delay
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
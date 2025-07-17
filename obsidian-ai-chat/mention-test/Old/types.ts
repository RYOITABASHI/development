// types.ts

export type SupportedModel =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash";

export interface ModelCallOptions {
  model: SupportedModel;
  prompt: string;
  stream?: boolean;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  onStreamChunk?: (chunk: string) => void;
}

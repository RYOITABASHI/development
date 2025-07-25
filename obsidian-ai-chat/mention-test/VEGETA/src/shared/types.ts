export const CHAT_VIEW_TYPE = "goku-chat";
export const EDITOR_VIEW_TYPE = "vegeta-terminal";

export type SupportedModel =
	| "gemini-2.5-pro"
	| "gemini-2.5-flash";

export interface ModelCallOptions {
	model: SupportedModel;
	prompt: string;
}
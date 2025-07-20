export const CHAT_VIEW_TYPE = "conductor-chat-view";
export const EDITOR_VIEW_TYPE = "conductor-editor-view";

export type SupportedModel =
	| "gemini-2.5-pro"
	| "gemini-2.5-flash";

export interface ModelCallOptions {
	model: SupportedModel;
	prompt: string;
}
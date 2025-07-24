import { ItemView, WorkspaceLeaf } from "obsidian";
import ReactDOM from "react-dom/client";
import React from "react";
import { ConductorProvider } from "../contexts/ConductorContext";
import { ConductorChatPane } from "../components/obsidian-conductor-ui";
import { CHAT_VIEW_TYPE } from "../types/types";

export class ChatView extends ItemView {
    private root: ReactDOM.Root | null = null;
    private borderPane: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return CHAT_VIEW_TYPE;
    }

    getDisplayText() {
        return "GOKU‐AI Chat";
    }

    async onOpen() {
        console.log('GOKU ChatView: onOpen called');
        try {
            // Clear any existing content and create a proper container
            this.containerEl.empty();
            this.containerEl.style.width = '100%';
            this.containerEl.style.height = '100%';
            this.containerEl.style.overflow = 'hidden';
            this.containerEl.style.position = 'relative';
            console.log('GOKU ChatView: Container prepared');
        
            // Force CSS injection for Obsidian environment
            this.injectConductorStyles();
            console.log('GOKU ChatView: Styles injected');
        
            const container = this.containerEl.createDiv();
            container.addClass('conductor-chat-container');
            container.style.width = '100%';
            container.style.height = '100%';
            console.log('GOKU ChatView: Container div created');
        
            // Create dynamic border pane
            try {
                this.createDynamicBorderPane();
                console.log('GOKU ChatView: Border pane created');
            } catch (borderError) {
                console.error('GOKU ChatView: Border pane creation failed:', borderError);
            }
        
            console.log('GOKU ChatView: Creating React root');
            
            // Check if ReactDOM is available
            if (!ReactDOM || !ReactDOM.createRoot) {
                throw new Error('ReactDOM.createRoot is not available');
            }
            
            this.root = ReactDOM.createRoot(container);
            console.log('GOKU ChatView: React root created');
            
            this.root.render(
                <React.StrictMode>
                    <ConductorProvider>
                        <ConductorChatPane />
                    </ConductorProvider>
                </React.StrictMode>
            );
            console.log('GOKU ChatView: React component rendered');
        } catch (error) {
            console.error('GOKU ChatView: Failed to open view:', error);
            // Fallback UI for debugging
            this.containerEl.empty();
            const errorDiv = this.containerEl.createDiv();
            errorDiv.setText(`GOKU Chat View Error: ${error.message}`);
            errorDiv.style.padding = '20px';
            errorDiv.style.color = 'red';
        }
    }

    private injectConductorStyles() {
        // Check if styles already injected
        if (document.getElementById('conductor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'conductor-styles';
        style.textContent = `
            /* Layout and Structure */
            .conductor-chat-container .w-full { width: 100% !important; }
            .conductor-chat-container .h-full { height: 100% !important; }
            .conductor-chat-container .flex { display: flex !important; }
            .conductor-chat-container .flex-col { flex-direction: column !important; }
            .conductor-chat-container .flex-1 { flex: 1 1 0% !important; }
            .conductor-chat-container .items-center { align-items: center !important; }
            .conductor-chat-container .justify-between { justify-content: space-between !important; }
            .conductor-chat-container .gap-1 { gap: 0.25rem !important; }
            .conductor-chat-container .gap-2 { gap: 0.5rem !important; }
            .conductor-chat-container .space-y-4 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 1rem !important;
                margin-bottom: 0 !important;
            }
            
            /* Border and Shape */
            .conductor-chat-container .border { border-width: 1px !important; }
            .conductor-chat-container .border-b { border-bottom-width: 1px !important; }
            .conductor-chat-container .border-t { border-top-width: 1px !important; }
            .conductor-chat-container .border-orange-600 {
                border-color: rgb(255, 165, 0) !important;
            }
            .conductor-chat-container .rounded { border-radius: 0.25rem !important; }
            .conductor-chat-container .rounded-full { border-radius: 9999px !important; }
            
            /* Background Colors */
            .conductor-chat-container .bg-black {
                background-color: rgb(0, 0, 0) !important;
            }
            .conductor-chat-container .bg-transparent {
                background-color: transparent !important;
            }
            .conductor-chat-container .bg-gray-800 {
                background-color: rgb(31, 41, 55) !important;
            }
            .conductor-chat-container .bg-gray-900 {
                background-color: rgb(17, 24, 39) !important;
            }
            .conductor-chat-container .bg-green-500 {
                background-color: rgb(34, 197, 94) !important;
            }
            
            /* Text Colors */
            .conductor-chat-container .text-orange-600 {
                color: rgb(255, 165, 0) !important;
            }
            .conductor-chat-container .text-gray-200 {
                color: rgb(229, 231, 235) !important;
            }
            .conductor-chat-container .text-gray-400 {
                color: rgb(156, 163, 175) !important;
            }
            
            /* Typography */
            .conductor-chat-container .font-mono {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace !important;
            }
            .conductor-chat-container .font-black { font-weight: 900 !important; }
            .conductor-chat-container .font-bold { font-weight: 700 !important; }
            .conductor-chat-container .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .conductor-chat-container .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            .conductor-chat-container .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            .conductor-chat-container .tracking-wide { letter-spacing: 0.025em !important; }
            
            /* Spacing */
            .conductor-chat-container .p-4 { padding: 1rem !important; }
            .conductor-chat-container .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
            .conductor-chat-container .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .conductor-chat-container .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .conductor-chat-container .pr-20 { padding-right: 5rem !important; }
            .conductor-chat-container .mb-2 { margin-bottom: 0.5rem !important; }
            .conductor-chat-container .ml-auto { margin-left: auto !important; }
            .conductor-chat-container .mr-2 { margin-right: 0.5rem !important; }
            .conductor-chat-container .w-1\\.5 { width: 0.375rem !important; }
            .conductor-chat-container .h-1\\.5 { height: 0.375rem !important; }
            
            /* Form Elements */
            .conductor-chat-container .resize-none { resize: none !important; }
            .conductor-chat-container .overflow-y-auto { overflow-y: auto !important; }
            
            /* Animations */
            .conductor-chat-container .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
            }
            .conductor-chat-container .transition-colors {
                transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
                transition-duration: 0.15s !important;
            }
            
            /* Hover Effects */
            .conductor-chat-container .hover\\:bg-orange-600:hover {
                background-color: rgb(255, 165, 0) !important;
            }
            .conductor-chat-container .hover\\:text-white:hover {
                color: rgb(255, 255, 255) !important;
            }
            .conductor-chat-container .hover\\:text-orange-400:hover {
                color: rgb(251, 146, 60) !important;
            }
            
            /* Additional Elements */
            .conductor-chat-container .absolute { position: absolute !important; }
            .conductor-chat-container .right-2 { right: 0.5rem !important; }
            .conductor-chat-container .bottom-2 { bottom: 0.5rem !important; }
            .conductor-chat-container .p-1 { padding: 0.25rem !important; }
            .conductor-chat-container .disabled\\:opacity-50:disabled { opacity: 0.5 !important; }
            .conductor-chat-container .border-2 { border-width: 2px !important; }
            .conductor-chat-container .border-transparent { border-color: transparent !important; }
            .conductor-chat-container .border-t-orange-400 { border-top-color: rgb(251, 146, 60) !important; }
            .conductor-chat-container .w-3\\.5 { width: 0.875rem !important; }
            .conductor-chat-container .h-3\\.5 { height: 0.875rem !important; }
            .conductor-chat-container .animate-spin { animation: spin 1s linear infinite !important; }
            
            /* Keyframes */
            @keyframes pulse {
                50% { opacity: .5; }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Obsidian sync status icon fix */
            .status-bar-item.mod-clickable {
                display: none !important;
            }
            .sync-status-icon {
                display: none !important;
            }
            
            /* Remove black background interference */
            .status-bar, .workspace-tab-container {
                background: transparent !important;
            }
            .workspace-ribbon {
                background: transparent !important;
            }
            .workspace-split.mod-vertical > * > .workspace-leaf-resize-handle,
            .workspace-split.mod-horizontal > * > .workspace-leaf-resize-handle {
                background-color: transparent !important;
            }
        `;
        document.head.appendChild(style);
    }

    private createDynamicBorderPane() {
        // Create the border pane element
        this.borderPane = this.containerEl.createDiv();
        this.borderPane.addClass('goku-pane');
        this.borderPane.style.position = 'absolute';
        this.borderPane.style.pointerEvents = 'none';
        this.borderPane.style.border = '2px solid orange';
        this.borderPane.style.boxSizing = 'border-box';
        this.borderPane.style.zIndex = '1000';
        
        // Set up resize observer for dynamic sizing
        this.setupResizeObserver();
        
        // Initial sizing
        this.updateBorderPaneSize();
    }

    private setupResizeObserver() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        this.resizeObserver = new ResizeObserver(() => {
            this.updateBorderPaneSize();
        });
        
        this.resizeObserver.observe(this.containerEl);
    }

    private updateBorderPaneSize() {
        if (!this.borderPane) return;
        
        const parent = this.containerEl;
        const borderThickness = 2; // 2px border
        
        // Calculate dimensions ensuring border fits completely inside
        const width = parent.clientWidth - (borderThickness * 2);
        const height = parent.clientHeight - (borderThickness * 2);
        
        // Apply calculated dimensions with proper positioning
        this.borderPane.style.width = `${width}px`;
        this.borderPane.style.height = `${height}px`;
        this.borderPane.style.top = '0px';
        this.borderPane.style.left = '0px';
        
        // Console log for debugging
        console.log('GOKU Border Pane Updated:', {
            parentWidth: parent.clientWidth,
            parentHeight: parent.clientHeight,
            calculatedWidth: width,
            calculatedHeight: height,
            borderThickness: borderThickness
        });
    }

    async onClose() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        
        this.borderPane = null;
    }
}

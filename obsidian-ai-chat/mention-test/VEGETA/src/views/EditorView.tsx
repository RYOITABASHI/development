import { ItemView, WorkspaceLeaf } from "obsidian";
import ReactDOM from "react-dom/client";
import React from "react";
import { ConductorProvider } from "../contexts/ConductorContext";
import { ConductorOutputPane } from "../components/obsidian-conductor-ui";
import { EDITOR_VIEW_TYPE } from "../types/types";

export class EditorView extends ItemView {
    private root: ReactDOM.Root | null = null;
    private borderPane: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return EDITOR_VIEW_TYPE;
    }

    getDisplayText() {
        return "VEGETA-Terminal";
    }

    async onOpen() {
        // Clear any existing content and create a proper container
        this.containerEl.empty();
        this.containerEl.style.width = '100%';
        this.containerEl.style.height = '100%';
        this.containerEl.style.overflow = 'hidden';
        this.containerEl.style.position = 'relative';
        
        // Force CSS injection for Obsidian environment
        this.injectConductorStyles();
        
        const container = this.containerEl.createDiv();
        container.addClass('conductor-editor-container');
        container.style.width = '100%';
        container.style.height = '100%';
        
        // Create dynamic border pane
        this.createDynamicBorderPane();
        
        this.root = ReactDOM.createRoot(container);
        this.root.render(
            <React.StrictMode>
                <ConductorProvider>
                    <ConductorOutputPane />
                </ConductorProvider>
            </React.StrictMode>
        );
    }

    private injectConductorStyles() {
        // Check if styles already injected
        if (document.getElementById('conductor-editor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'conductor-editor-styles';
        style.textContent = `
            /* Layout and Structure */
            .conductor-editor-container .w-full { width: 100% !important; }
            .conductor-editor-container .h-full { height: 100% !important; }
            .conductor-editor-container .flex { display: flex !important; }
            .conductor-editor-container .flex-col { flex-direction: column !important; }
            .conductor-editor-container .flex-1 { flex: 1 1 0% !important; }
            .conductor-editor-container .items-center { align-items: center !important; }
            .conductor-editor-container .justify-center { justify-content: center !important; }
            .conductor-editor-container .justify-between { justify-content: space-between !important; }
            .conductor-editor-container .gap-1 { gap: 0.25rem !important; }
            .conductor-editor-container .gap-2 { gap: 0.5rem !important; }
            .conductor-editor-container .flex-wrap { flex-wrap: wrap !important; }
            
            /* Border and Shape */
            .conductor-editor-container .border { border-width: 1px !important; }
            .conductor-editor-container .border-b { border-bottom-width: 1px !important; }
            .conductor-editor-container .border-t { border-top-width: 1px !important; }
            .conductor-editor-container .border-navy-600 {
                border-color: rgb(99, 162, 255) !important;
            }
            .conductor-editor-container .rounded { border-radius: 0.25rem !important; }
            
            /* Background Colors */
            .conductor-editor-container .bg-black {
                background-color: rgb(0, 0, 0) !important;
            }
            .conductor-editor-container .bg-gray-800 {
                background-color: rgb(31, 41, 55) !important;
            }
            .conductor-editor-container .bg-gray-900 {
                background-color: rgb(17, 24, 39) !important;
            }
            
            /* Text Colors */
            .conductor-editor-container .text-navy-600 {
                color: rgb(99, 162, 255) !important;
            }
            .conductor-editor-container .text-gray-200 {
                color: rgb(229, 231, 235) !important;
            }
            .conductor-editor-container .text-gray-400 {
                color: rgb(156, 163, 175) !important;
            }
            .conductor-editor-container .text-gray-500 {
                color: rgb(107, 114, 128) !important;
            }
            
            /* Typography */
            .conductor-editor-container .font-mono {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace !important;
            }
            .conductor-editor-container .font-bold { font-weight: 700 !important; }
            .conductor-editor-container .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
            .conductor-editor-container .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            
            /* Spacing */
            .conductor-editor-container .p-3 { padding: 0.75rem !important; }
            .conductor-editor-container .p-4 { padding: 1rem !important; }
            .conductor-editor-container .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
            .conductor-editor-container .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .conductor-editor-container .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
            .conductor-editor-container .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            
            /* Layout Utilities */
            .conductor-editor-container .overflow-y-auto { overflow-y: auto !important; }
            .conductor-editor-container .relative { position: relative !important; }
            .conductor-editor-container .overflow-hidden { overflow: hidden !important; }
            
            /* Transitions */
            .conductor-editor-container .transition-colors {
                transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
                transition-duration: 0.15s !important;
            }
            
            /* Hover Effects */
            .conductor-editor-container .hover\\:bg-navy-600:hover {
                background-color: rgb(99, 162, 255) !important;
            }
            .conductor-editor-container .hover\\:text-white:hover {
                color: rgb(255, 255, 255) !important;
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
        this.borderPane.addClass('vegeta-pane');
        this.borderPane.style.position = 'absolute';
        this.borderPane.style.pointerEvents = 'none';
        this.borderPane.style.border = '2px solid navy';
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
        console.log('VEGETA Border Pane Updated:', {
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

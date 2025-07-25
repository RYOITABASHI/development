import { ItemView, WorkspaceLeaf } from "obsidian";
import ReactDOM from "react-dom/client";
import React from "react";
import { ConductorProvider } from "../shared/contexts/ConductorContext";
import { ConductorOutputPane } from "../shared/components/obsidian-conductor-ui";
import { EDITOR_VIEW_TYPE } from "../shared/types";

export class PCEditorView extends ItemView {
    private root: ReactDOM.Root | null = null;
    private borderPane: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private plugin: any;

    constructor(leaf: WorkspaceLeaf, plugin?: any) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return EDITOR_VIEW_TYPE;
    }

    getDisplayText() {
        return "VEGETA-Terminal (PC)";
    }

    async onOpen() {
        console.log('VEGETA PC EditorView: onOpen called');
        try {
            // PC-optimized initialization
            this.containerEl.empty();
            this.containerEl.style.width = '100%';
            this.containerEl.style.height = '100%';
            this.containerEl.style.overflow = 'hidden';
            this.containerEl.style.position = 'relative';
            console.log('VEGETA PC EditorView: Container prepared');
        
            // Force CSS injection for Obsidian environment
            this.injectConductorStyles();
            console.log('VEGETA PC EditorView: Styles injected');
        
            const container = this.containerEl.createDiv();
            container.addClass('conductor-editor-container', 'pc-optimized');
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            console.log('VEGETA PC EditorView: Container div created');
        
            // Create dynamic border pane (PC only feature)
            try {
                this.createDynamicBorderPane();
                console.log('VEGETA PC EditorView: Border pane created');
            } catch (borderError) {
                console.error('VEGETA PC EditorView: Border pane creation failed:', borderError);
                if (this.plugin?.logToVaultFile) {
                    await this.plugin.logToVaultFile(borderError);
                }
            }
        
            console.log('VEGETA PC EditorView: Creating React root');
            
            // Check if ReactDOM is available
            if (!ReactDOM || !ReactDOM.createRoot) {
                throw new Error('ReactDOM.createRoot is not available');
            }
            
            this.root = ReactDOM.createRoot(container);
            console.log('VEGETA PC EditorView: React root created');
            
            this.root.render(
                <React.StrictMode>
                    <ConductorProvider>
                        <ConductorOutputPane />
                    </ConductorProvider>
                </React.StrictMode>
            );
            console.log('VEGETA PC EditorView: React component rendered');
        } catch (error) {
            console.error('VEGETA PC EditorView: Failed to open view:', error);
            if (this.plugin?.logToVaultFile) {
                await this.plugin.logToVaultFile(error);
            }
            // Fallback UI for debugging
            this.containerEl.empty();
            const errorDiv = this.containerEl.createDiv();
            errorDiv.setText(`VEGETA PC Editor View Error: ${error.message}`);
            errorDiv.style.padding = '20px';
            errorDiv.style.color = 'red';
        }
    }

    private injectConductorStyles() {
        // Check if styles already injected
        if (document.getElementById('conductor-pc-editor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'conductor-pc-editor-styles';
        style.textContent = `
            /* PC-optimized styles */
            .conductor-editor-container.pc-optimized {
                padding: 0.5rem !important;
                /* Enhanced visuals for PC */
                box-shadow: 0 0 10px rgba(99, 162, 255, 0.1) !important;
                border: 1px solid rgba(99, 162, 255, 0.4) !important;
            }
            
            /* PC-specific hover effects */
            .pc-optimized button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            /* Enhanced scrollbars for PC */
            .pc-optimized::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            
            .pc-optimized::-webkit-scrollbar-thumb {
                background: rgba(99, 162, 255, 0.6);
                border-radius: 6px;
            }
            
            .pc-optimized::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 162, 255, 0.8);
            }
        `;
        document.head.appendChild(style);
    }

    private createDynamicBorderPane() {
        // PC-specific feature: Dynamic border pane
        this.borderPane = this.containerEl.createDiv();
        this.borderPane.addClass('vegeta-pane', 'pc-border');
        this.borderPane.style.position = 'absolute';
        this.borderPane.style.pointerEvents = 'none';
        this.borderPane.style.border = '2px solid navy';
        this.borderPane.style.boxSizing = 'border-box';
        this.borderPane.style.zIndex = '1000';
        this.borderPane.style.borderRadius = '4px';
        
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
        const borderThickness = 2;
        
        const width = parent.clientWidth - (borderThickness * 2);
        const height = parent.clientHeight - (borderThickness * 2);
        
        this.borderPane.style.width = `${width}px`;
        this.borderPane.style.height = `${height}px`;
        this.borderPane.style.top = '0px';
        this.borderPane.style.left = '0px';
    }

    async onClose() {
        console.log('VEGETA PC EditorView: Closing view');
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        
        if (this.borderPane) {
            this.borderPane.remove();
            this.borderPane = null;
        }
    }
}
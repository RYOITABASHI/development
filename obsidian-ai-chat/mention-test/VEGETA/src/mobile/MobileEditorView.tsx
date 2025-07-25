import { ItemView, WorkspaceLeaf } from "obsidian";
import ReactDOM from "react-dom/client";
import React from "react";
import { ConductorProvider } from "../shared/contexts/ConductorContext";
import { ConductorOutputPane } from "../shared/components/obsidian-conductor-ui";
import { EDITOR_VIEW_TYPE } from "../shared/types";

export class MobileEditorView extends ItemView {
    private root: ReactDOM.Root | null = null;
    private plugin: any;
    private initTimeout: NodeJS.Timeout | null = null;

    constructor(leaf: WorkspaceLeaf, plugin?: any) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return EDITOR_VIEW_TYPE;
    }

    getDisplayText() {
        return "VEGETA-Terminal (Mobile)";
    }

    async waitForContainerReady(): Promise<void> {
        let attempts = 0;
        while (attempts < 10) {
            if (this.containerEl && this.containerEl.parentElement) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }

    async waitForContainerSize(): Promise<void> {
        let attempts = 0;
        while (attempts < 10) {
            const rect = this.containerEl.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }

    async onOpen() {
        console.log('VEGETA Mobile EditorView: onOpen called');
        try {
            // Mobile-optimized initialization with delays
            await this.waitForContainerReady();
            
            this.containerEl.empty();
            this.containerEl.style.width = '100%';
            this.containerEl.style.height = '100%';
            this.containerEl.style.overflow = 'hidden';
            this.containerEl.style.position = 'relative';
            this.containerEl.addClass('mobile-terminal-view');
            console.log('VEGETA Mobile EditorView: Container prepared');
        
            // Mobile-specific CSS injection
            this.injectMobileConductorStyles();
            console.log('VEGETA Mobile EditorView: Mobile styles injected');
        
            const container = this.containerEl.createDiv();
            container.addClass('conductor-editor-container', 'mobile-optimized');
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.padding = '0.25rem';
            console.log('VEGETA Mobile EditorView: Container div created');
        
            console.log('VEGETA Mobile EditorView: Creating React root');
            
            // Check if ReactDOM is available
            if (!ReactDOM || !ReactDOM.createRoot) {
                throw new Error('ReactDOM.createRoot is not available');
            }
            
            // Wait for container to be properly sized
            await this.waitForContainerSize();
            
            // Add delay for mobile DOM stabilization
            await new Promise(resolve => setTimeout(resolve, 300));
            
            this.root = ReactDOM.createRoot(container);
            console.log('VEGETA Mobile EditorView: React root created');
            
            this.root.render(
                <React.StrictMode>
                    <ConductorProvider>
                        <ConductorOutputPane />
                    </ConductorProvider>
                </React.StrictMode>
            );
            console.log('VEGETA Mobile EditorView: React component rendered');
        } catch (error) {
            console.error('VEGETA Mobile EditorView: Failed to open view:', error);
            if (this.plugin?.logToVaultFile) {
                await this.plugin.logToVaultFile(error);
            }
            // Simplified fallback UI for mobile
            this.containerEl.empty();
            const errorDiv = this.containerEl.createDiv();
            errorDiv.setText(`VEGETA Mobile Error: ${error.message}`);
            errorDiv.style.padding = '16px';
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '16px';
        }
    }

    private injectMobileConductorStyles() {
        // Check if styles already injected
        if (document.getElementById('conductor-mobile-editor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'conductor-mobile-editor-styles';
        style.textContent = `
            /* Mobile-optimized styles */
            .conductor-editor-container.mobile-optimized {
                padding: 0.25rem !important;
                margin: 0 !important;
                border: none !important;
                /* Mobile touch optimizations */
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .mobile-terminal-view {
                width: 100% !important;
                height: 100% !important;
                position: relative !important;
                overflow: hidden !important;
            }
            
            /* Touch-friendly buttons */
            .mobile-optimized button,
            .mobile-optimized .clickable {
                min-height: 44px !important;
                min-width: 44px !important;
                padding: 12px !important;
                touch-action: manipulation;
                font-size: 16px !important;
            }
            
            /* Prevent zoom on inputs */
            .mobile-optimized input,
            .mobile-optimized textarea {
                font-size: 16px !important;
                touch-action: manipulation;
            }
            
            /* Mobile scrollbars */
            .mobile-optimized::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            
            .mobile-optimized::-webkit-scrollbar-thumb {
                background: rgba(99, 162, 255, 0.4);
                border-radius: 3px;
            }
            
            /* Mobile typography */
            .mobile-optimized .text-xs { 
                font-size: 14px !important; 
            }
            .mobile-optimized .text-sm { 
                font-size: 16px !important; 
            }
            
            /* Landscape adjustments */
            @media (orientation: landscape) and (max-height: 500px) {
                .mobile-optimized {
                    padding: 0.125rem !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    async onClose() {
        console.log('VEGETA Mobile EditorView: Closing view');
        
        if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = null;
        }
        
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        
        // Clear container to free memory on mobile
        this.containerEl.empty();
    }
}
import { Plugin } from "obsidian";
import { ChatView } from "./views/ChatView";
import { CHAT_VIEW_TYPE } from "./types/types";
import "./styles/conductor.css";

class GokuMultiModelPlugin extends Plugin {
    async onload() {
        console.log('GOKU: Plugin loading started');
        this.logToFile('GOKU plugin loading started', 'info');
        try {
            this.registerView(CHAT_VIEW_TYPE, (leaf) => new ChatView(leaf));
            console.log('GOKU: View registered successfully');
            this.logToFile('View registered successfully', 'info');
        } catch (error) {
            console.error('GOKU: Failed to register view:', error);
            this.logToFile(`Failed to register view: ${error}`, 'error');
        }

        this.addRibbonIcon('message-square', 'Open GOKU‐AI Chat', async () => {
            await this.setupChatView();
        });

        this.addCommand({
            id: "setup-goku-chat",
            name: "Setup GOKU‐AI Chat",
            callback: async () => {
                await this.setupChatView();
            },
        });

        if (this.app.isMobile) {
            console.log('GOKU: Mobile environment detected');
            this.logToFile('Mobile environment detected', 'info');
            this.setupMobileView();
        } else {
            console.log('GOKU: Desktop environment detected');
            this.logToFile('Desktop environment detected', 'info');
            this.app.workspace.onLayoutReady(() => {
                this.setupChatView();
            });
        }
    }

    async setupMobileView() {
        try {
            // Mobile-specific initialization with improved timing
            await this.waitForWorkspaceReady();
            
            // Wait for DOM to be fully ready on mobile
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve, { once: true });
                });
            }
            
            // Additional delay for mobile to ensure all components are loaded
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await this.setupChatView();
            this.logToFile('GOKU mobile initialization successful', 'info');
        } catch (error) {
            console.error('GOKU: Mobile setup error:', error);
            this.logToFile(`GOKU mobile initialization failed: ${error.message}`, 'error');
            
            // Retry setup after a delay if initial attempt fails
            setTimeout(() => {
                this.setupChatView().catch(e => {
                    console.error('GOKU: Retry failed:', e);
                    this.logToFile(`GOKU retry failed: ${e.message}`, 'error');
                });
            }, 2000);
        }
    }

    async waitForWorkspaceReady(): Promise<void> {
        return new Promise((resolve) => {
            if (this.app.workspace.layoutReady) {
                resolve();
                return;
            }
            
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds maximum wait
            
            const checkReady = () => {
                attempts++;
                if (this.app.workspace.layoutReady || attempts >= maxAttempts) {
                    resolve();
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            
            setTimeout(checkReady, 100);
        });
    }

    async setupChatView() {
        console.log('GOKU: setupChatView called');
        this.logToFile('setupChatView called', 'info');
        try {
            const { workspace } = this.app;
            workspace.detachLeavesOfType(CHAT_VIEW_TYPE);

            // Mobile-compatible pane selection
            let targetLeaf;
            if (this.app.isMobile) {
                console.log('GOKU: Creating mobile leaf');
                this.logToFile('Creating mobile leaf', 'info');
                // On mobile, use the main leaf or create a new one
                targetLeaf = workspace.getLeaf('tab');
                if (!targetLeaf) {
                    targetLeaf = workspace.getLeaf(true); // fallback
                    console.warn('GOKU: Fallback: created new leaf for mobile');
                    this.logToFile('Fallback: created new leaf for mobile', 'warn');
                }
            } else {
                // Force GOKU to open in center pane on desktop
                targetLeaf = workspace.getLeaf(false);
            }
            
            console.log('GOKU: Setting view state');
            this.logToFile('Setting view state', 'info');
            await targetLeaf.setViewState({
                type: CHAT_VIEW_TYPE,
                active: true,
            });
            console.log('GOKU: View state set successfully');
            this.logToFile('View state set successfully', 'info');
            
            // Add delay for rendering stabilization
            await new Promise(resolve => setTimeout(resolve, 500));

            workspace.revealLeaf(targetLeaf);
            workspace.setActiveLeaf(targetLeaf, { focus: true });
            console.log('GOKU: Chat view setup completed');
            this.logToFile('Chat view setup completed', 'info');
        } catch (error) {
            console.error('GOKU: Setup error:', error);
            this.logToFile(`GOKU setup error: ${error.message}`, 'error');
        }
    }

    logToFile(message: string, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [GOKU] [${level.toUpperCase()}] ${message}\n`;
        
        // Use Obsidian's file system API
        const logPath = '.goku.log';
        this.app.vault.adapter.append(logPath, logEntry).catch(err => {
            console.error('Failed to write to log file:', err);
        });
    }

    onunload() {
        this.logToFile('GOKU plugin unloaded', 'info');
        this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);
    }
}

export default GokuMultiModelPlugin;
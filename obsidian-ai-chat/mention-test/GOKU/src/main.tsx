import { Plugin, Platform, normalizePath } from "obsidian";
import { ChatView } from "./views/ChatView";
import { CHAT_VIEW_TYPE } from "./types/types";
import "./styles/conductor.css";

class GokuMultiModelPlugin extends Plugin {
    private retryCount = 0;
    private maxRetries = 5;
    private statusBarItem: HTMLElement | null = null;

    async onload() {
        console.log('GOKU: Plugin loading started');
        this.logToFile('GOKU plugin loading started', 'info');
        await this.logToVaultFile(`GOKU plugin loading - Platform: ${this.app.isMobile ? 'MOBILE' : 'DESKTOP'}, App version: ${this.app.vault.adapter.appId || 'unknown'}`);
        
        // Create status bar item for mobile feedback
        if (Platform.isMobile) {
            this.statusBarItem = this.addStatusBarItem();
            this.statusBarItem.setText('GOKU initializing...');
        }

        // Wrap all UI registration inside onLayoutReady for mobile compatibility
        this.app.workspace.onLayoutReady(() => {
            try {
                this.registerView(CHAT_VIEW_TYPE, (leaf) => new ChatView(leaf, this));
                console.log('GOKU: View registered successfully');
                this.logToFile('View registered successfully', 'info');
            } catch (error) {
                console.error('GOKU: Failed to register view:', error);
                this.logToFile(`Failed to register view: ${error}`, 'error');
                this.logToVaultFile(error);
            }

            // Add ribbon icon with mobile-safe implementation
            try {
                this.addRibbonIcon('message-square', 'Open GOKU‐AI Chat', async () => {
                    await this.setupChatView();
                });
                console.log('GOKU: Ribbon icon added');
                this.logToFile('Ribbon icon added', 'info');
            } catch (error) {
                console.error('GOKU: Failed to add ribbon icon:', error);
                this.logToFile(`Failed to add ribbon icon: ${error}`, 'error');
                this.logToVaultFile(error);
            }

            if (Platform.isMobile || this.app.isMobile) {
                console.log('GOKU: Mobile environment detected');
                this.logToFile('Mobile environment detected', 'info');
                this.logToVaultFile('モバイル環境で起動');
                this.setupMobileView();
            } else {
                console.log('GOKU: Desktop environment detected');
                this.logToFile('Desktop environment detected', 'info');
                this.setupChatView();
            }
        });

        this.addCommand({
            id: "setup-goku-chat",
            name: "Setup GOKU‐AI Chat",
            callback: async () => {
                await this.setupChatView();
            },
        });
    }

    async setupMobileView() {
        try {
            // Mobile-specific initialization with improved timing
            await this.waitForWorkspaceReady();
            await this.logToVaultFile('Mobile: workspace ready');
            
            // Ensure full DOM and mobile app readiness
            await this.waitForMobileReady();
            await this.logToVaultFile('Mobile: app fully ready');
            
            // Try to setup view with retry mechanism
            const success = await this.setupChatViewWithRetry();
            
            if (success) {
                this.logToFile('GOKU mobile initialization successful', 'info');
                await this.logToVaultFile('Mobile: initialization successful');
                this.updateStatusBar('GOKU ready');
            } else {
                throw new Error('Failed to setup view after retries');
            }
        } catch (error) {
            console.error('GOKU: Mobile setup error:', error);
            this.logToFile(`GOKU mobile initialization failed: ${error.message}`, 'error');
            await this.logToVaultFile(error);
            this.updateStatusBar('GOKU failed to load');
        }
    }

    async waitForMobileReady(): Promise<void> {
        // Wait for DOM
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve, { once: true });
            });
        }
        
        // Wait for Obsidian mobile app to be fully ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Wait for any active view transitions
        while (this.app.workspace.activeLeaf?.view?.containerEl?.classList.contains('is-loading')) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async setupChatViewWithRetry(): Promise<boolean> {
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                await this.setupChatView();
                return true;
            } catch (error) {
                console.warn(`GOKU: Setup attempt ${i + 1} failed:`, error);
                await this.logToVaultFile(`Retry ${i + 1}: ${error.message}`);
                
                if (i < this.maxRetries - 1) {
                    // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                }
            }
        }
        return false;
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
            if (Platform.isMobile || this.app.isMobile) {
                console.log('GOKU: Creating mobile leaf');
                this.logToFile('Creating mobile leaf', 'info');
                await this.logToVaultFile('Mobile: attempting to create leaf');
                
                // Mobile: Try different methods to get a leaf
                const existingLeaves = workspace.getLeavesOfType(CHAT_VIEW_TYPE);
                if (existingLeaves.length > 0) {
                    targetLeaf = existingLeaves[0];
                    await this.logToVaultFile('Mobile: reusing existing leaf');
                } else {
                    // Try multiple approaches for mobile
                    targetLeaf = workspace.getMostRecentLeaf();
                    
                    if (!targetLeaf || !targetLeaf.view) {
                        // Try to get the root split
                        const rootSplit = workspace.rootSplit;
                        if (rootSplit) {
                            targetLeaf = workspace.getLeaf(true);
                            await this.logToVaultFile('Mobile: created new leaf from root split');
                        }
                    }
                    
                    if (!targetLeaf) {
                        // Last resort: create in active pane
                        targetLeaf = workspace.getLeaf('tab');
                        if (!targetLeaf) {
                            targetLeaf = workspace.getLeaf(true);
                        }
                        await this.logToVaultFile('Mobile: created new leaf (fallback)');
                    } else {
                        await this.logToVaultFile('Mobile: using most recent leaf');
                    }
                }
            } else {
                // Force GOKU to open in center pane on desktop
                targetLeaf = workspace.getLeaf(false);
            }
            
            if (!targetLeaf) {
                throw new Error('Failed to create or get leaf');
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
            await this.logToVaultFile(error);
        }
    }

    logToFile(message: string, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [GOKU] [${level.toUpperCase()}] ${message}\n`;
        
        // Use Obsidian's file system API
        const logPath = normalizePath('.goku.log');
        this.app.vault.adapter.append(logPath, logEntry).catch(err => {
            console.error('Failed to write to log file:', err);
        });
    }

    async logToVaultFile(error: Error | string): Promise<void> {
        try {
            const timestamp = new Date().toISOString();
            const errorMessage = error instanceof Error ? 
                `${error.name}: ${error.message}\nStack: ${error.stack}` : 
                String(error);
            const logEntry = `[${timestamp}] [GOKU] ERROR:\n${errorMessage}\n\n`;
            
            // Ensure log directory exists
            const logDir = normalizePath('90_Log');
            const logPath = normalizePath(`${logDir}/myplugin.log`);
            
            try {
                await this.app.vault.adapter.stat(logDir);
            } catch {
                await this.app.vault.adapter.mkdir(logDir);
            }
            
            // Append to log file
            await this.app.vault.adapter.append(logPath, logEntry);
        } catch (logError) {
            console.error('GOKU: Failed to write to vault log:', logError);
        }
    }

    updateStatusBar(text: string) {
        if (this.statusBarItem) {
            this.statusBarItem.setText(text);
        }
    }

    onunload() {
        this.logToFile('GOKU plugin unloaded', 'info');
        this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);
        if (this.statusBarItem) {
            this.statusBarItem.remove();
        }
    }
}

export default GokuMultiModelPlugin;
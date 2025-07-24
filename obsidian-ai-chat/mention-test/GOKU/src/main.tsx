import { Plugin, Platform, normalizePath } from "obsidian";
import { ChatView } from "./views/ChatView";
import { CHAT_VIEW_TYPE } from "./types/types";
import "./styles/conductor.css";

class GokuMultiModelPlugin extends Plugin {
    async onload() {
        console.log('GOKU: Plugin loading started');
        this.logToFile('GOKU plugin loading started', 'info');
        await this.logToVaultFile(`GOKU plugin loading - Platform: ${this.app.isMobile ? 'MOBILE' : 'DESKTOP'}, App version: ${this.app.vault.adapter.appId || 'unknown'}`);
        try {
            this.registerView(CHAT_VIEW_TYPE, (leaf) => new ChatView(leaf, this));
            console.log('GOKU: View registered successfully');
            this.logToFile('View registered successfully', 'info');
        } catch (error) {
            console.error('GOKU: Failed to register view:', error);
            this.logToFile(`Failed to register view: ${error}`, 'error');
            await this.logToVaultFile(error);
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
            await this.logToVaultFile(error);
        }

        this.addCommand({
            id: "setup-goku-chat",
            name: "Setup GOKU‐AI Chat",
            callback: async () => {
                await this.setupChatView();
            },
        });

        if (Platform.isMobile || this.app.isMobile) {
            console.log('GOKU: Mobile environment detected');
            this.logToFile('Mobile environment detected', 'info');
            await this.logToVaultFile('モバイル環境で起動');
            
            // Ensure mobile view setup happens after layout is ready
            if (this.app.workspace.layoutReady) {
                await this.setupMobileView();
            } else {
                this.app.workspace.onLayoutReady(async () => {
                    await this.setupMobileView();
                });
            }
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
            await this.logToVaultFile('Mobile: workspace ready');
            
            // Wait for DOM to be fully ready on mobile
            if (document.readyState !== 'complete') {
                await this.logToVaultFile('Mobile: waiting for DOM complete');
                await new Promise(resolve => {
                    window.addEventListener('load', resolve, { once: true });
                });
            }
            await this.logToVaultFile('Mobile: DOM ready');
            
            // Additional delay for mobile to ensure all components are loaded
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.logToVaultFile('Mobile: additional delay completed');
            
            await this.setupChatView();
            this.logToFile('GOKU mobile initialization successful', 'info');
            await this.logToVaultFile('Mobile: initialization successful');
        } catch (error) {
            console.error('GOKU: Mobile setup error:', error);
            this.logToFile(`GOKU mobile initialization failed: ${error.message}`, 'error');
            await this.logToVaultFile(error);
            
            // Retry setup after a delay if initial attempt fails
            setTimeout(async () => {
                try {
                    await this.setupChatView();
                } catch (e) {
                    console.error('GOKU: Retry failed:', e);
                    this.logToFile(`GOKU retry failed: ${e.message}`, 'error');
                    await this.logToVaultFile(e);
                }
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
                    // Try to get active leaf first
                    targetLeaf = workspace.getMostRecentLeaf();
                    if (!targetLeaf) {
                        targetLeaf = workspace.getLeaf(true);
                        await this.logToVaultFile('Mobile: created new leaf');
                    } else {
                        await this.logToVaultFile('Mobile: using most recent leaf');
                    }
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

    onunload() {
        this.logToFile('GOKU plugin unloaded', 'info');
        this.app.workspace.detachLeavesOfType(CHAT_VIEW_TYPE);
    }
}

export default GokuMultiModelPlugin;
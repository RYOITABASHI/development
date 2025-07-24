import { Plugin, Platform, normalizePath } from "obsidian";
import { EditorView } from "./views/EditorView";
import { EDITOR_VIEW_TYPE } from "./types/types";
import "./styles/conductor.css";

class VegetaTerminalPlugin extends Plugin {
    async onload() {
        console.log('VEGETA: Plugin loading started');
        this.logToFile('VEGETA plugin loading started', 'info');
        await this.logToVaultFile(`VEGETA plugin loading - Platform: ${this.app.isMobile ? 'MOBILE' : 'DESKTOP'}, App version: ${this.app.vault.adapter.appId || 'unknown'}`);
        try {
            this.registerView(EDITOR_VIEW_TYPE, (leaf) => new EditorView(leaf, this));
            console.log('VEGETA: View registered successfully');
            this.logToFile('View registered successfully', 'info');
        } catch (error) {
            console.error('VEGETA: Failed to register view:', error);
            this.logToFile(`Failed to register view: ${error}`, 'error');
            await this.logToVaultFile(error);
        }

        // Add ribbon icon with mobile-safe implementation
        try {
            this.addRibbonIcon('terminal-square', 'Open VEGETA‐Terminal', async () => {
                await this.setupTerminalView();
            });
            console.log('VEGETA: Ribbon icon added');
            this.logToFile('Ribbon icon added', 'info');
        } catch (error) {
            console.error('VEGETA: Failed to add ribbon icon:', error);
            this.logToFile(`Failed to add ribbon icon: ${error}`, 'error');
            await this.logToVaultFile(error);
        }

        this.addCommand({
            id: "setup-vegeta-terminal",
            name: "Setup VEGETA‐Terminal",
            callback: async () => {
                await this.setupTerminalView();
            },
        });

        if (Platform.isMobile || this.app.isMobile) {
            console.log('VEGETA: Mobile environment detected');
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
            console.log('VEGETA: Desktop environment detected');
            this.logToFile('Desktop environment detected', 'info');
            this.app.workspace.onLayoutReady(() => {
                this.setupTerminalView();
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
            
            await this.setupTerminalView();
            this.logToFile('VEGETA mobile initialization successful', 'info');
            await this.logToVaultFile('Mobile: initialization successful');
        } catch (error) {
            console.error('VEGETA: Mobile setup error:', error);
            this.logToFile(`VEGETA mobile initialization failed: ${error.message}`, 'error');
            await this.logToVaultFile(error);
            
            // Retry setup after a delay if initial attempt fails
            setTimeout(async () => {
                try {
                    await this.setupTerminalView();
                } catch (e) {
                    console.error('VEGETA: Retry failed:', e);
                    this.logToFile(`VEGETA retry failed: ${e.message}`, 'error');
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

    async setupTerminalView() {
        console.log('VEGETA: setupTerminalView called');
        this.logToFile('setupTerminalView called', 'info');
        try {
            const { workspace } = this.app;
            workspace.detachLeavesOfType(EDITOR_VIEW_TYPE);

            // Mobile-compatible pane selection
            let targetLeaf;
            if (Platform.isMobile || this.app.isMobile) {
                console.log('VEGETA: Creating mobile leaf');
                this.logToFile('Creating mobile leaf', 'info');
                await this.logToVaultFile('Mobile: attempting to create leaf');
                
                // Mobile: Try different methods to get a leaf
                const existingLeaves = workspace.getLeavesOfType(EDITOR_VIEW_TYPE);
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
                // Force VEGETA to open in right pane on desktop
                targetLeaf = workspace.getRightLeaf(false);
            }
            
            console.log('VEGETA: Setting view state');
            this.logToFile('Setting view state', 'info');
            await targetLeaf.setViewState({
                type: EDITOR_VIEW_TYPE,
                active: true,
            });
            console.log('VEGETA: View state set successfully');
            this.logToFile('View state set successfully', 'info');
            
            // Add delay for rendering stabilization
            await new Promise(resolve => setTimeout(resolve, 500));

            workspace.revealLeaf(targetLeaf);
            workspace.setActiveLeaf(targetLeaf, { focus: true });
            console.log('VEGETA: Terminal view setup completed');
            this.logToFile('Terminal view setup completed', 'info');
        } catch (error) {
            console.error('VEGETA: Setup error:', error);
            this.logToFile(`VEGETA setup error: ${error.message}`, 'error');
            await this.logToVaultFile(error);
        }
    }

    logToFile(message: string, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [VEGETA] [${level.toUpperCase()}] ${message}\n`;
        
        // Use Obsidian's file system API
        const logPath = normalizePath('.vegeta.log');
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
            const logEntry = `[${timestamp}] [VEGETA] ERROR:\n${errorMessage}\n\n`;
            
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
            console.error('VEGETA: Failed to write to vault log:', logError);
        }
    }

    onunload() {
        this.logToFile('VEGETA plugin unloaded', 'info');
        this.app.workspace.detachLeavesOfType(EDITOR_VIEW_TYPE);
    }
}

export default VegetaTerminalPlugin;
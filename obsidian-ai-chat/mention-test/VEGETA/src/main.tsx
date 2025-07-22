import { Plugin } from "obsidian";
import { EditorView } from "./views/EditorView";
import { EDITOR_VIEW_TYPE } from "./types/types";
import "./styles/conductor.css";

class VegetaTerminalPlugin extends Plugin {
    async onload() {
        this.registerView(EDITOR_VIEW_TYPE, (leaf) => new EditorView(leaf));

        this.addRibbonIcon('terminal-square', 'Open VEGETA‐Terminal', async () => {
            await this.setupTerminalView();
        });

        this.addCommand({
            id: "setup-vegeta-terminal",
            name: "Setup VEGETA‐Terminal",
            callback: async () => {
                await this.setupTerminalView();
            },
        });

        if (this.app.isMobile) {
            this.setupMobileView();
        } else {
            this.app.workspace.onLayoutReady(() => {
                this.setupTerminalView();
            });
        }
    }

    async setupMobileView() {
        try {
            // Mobile-specific initialization with improved timing
            await this.waitForWorkspaceReady();
            
            // Additional delay for mobile to ensure all components are loaded
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await this.setupTerminalView();
            this.logToFile('VEGETA mobile initialization successful', 'info');
        } catch (error) {
            console.error('VEGETA: Mobile setup error:', error);
            this.logToFile(`VEGETA mobile initialization failed: ${error.message}`, 'error');
            
            // Retry setup after a delay if initial attempt fails
            setTimeout(() => {
                this.setupTerminalView().catch(e => 
                    console.error('VEGETA: Retry failed:', e)
                );
            }, 1000);
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
        try {
            const { workspace } = this.app;
            workspace.detachLeavesOfType(EDITOR_VIEW_TYPE);

            // Mobile-compatible pane selection
            let targetLeaf;
            if (this.app.isMobile) {
                // On mobile, use a new tab since mobile may not have right pane
                targetLeaf = workspace.getLeaf('tab');
            } else {
                // Force VEGETA to open in right pane on desktop
                targetLeaf = workspace.getRightLeaf(false);
            }
            
            await targetLeaf.setViewState({
                type: EDITOR_VIEW_TYPE,
                active: true,
            });

            workspace.revealLeaf(targetLeaf);
            workspace.setActiveLeaf(targetLeaf, { focus: true });
        } catch (error) {
            console.error('VEGETA: Setup error:', error);
            this.logToFile(`VEGETA setup error: ${error.message}`, 'error');
        }
    }

    logToFile(message: string, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [VEGETA] [${level.toUpperCase()}] ${message}\n`;
        
        // Use Obsidian's file system API
        const logPath = '.vegeta.log';
        this.app.vault.adapter.append(logPath, logEntry).catch(err => {
            console.error('Failed to write to log file:', err);
        });
    }

    onunload() {
        this.logToFile('VEGETA plugin unloaded', 'info');
        this.app.workspace.detachLeavesOfType(EDITOR_VIEW_TYPE);
    }
}

export default VegetaTerminalPlugin;
import { Plugin, normalizePath } from "obsidian";
import { useDeviceType, getOptimalConfig } from "./shared/useDeviceType";
import { PCEditorView } from "./pc/PCEditorView";
import { MobileEditorView } from "./mobile/MobileEditorView";
import { EDITOR_VIEW_TYPE } from "./shared/types";
import "./styles/conductor.css";

class VegetaTerminalPlugin extends Plugin {
    private deviceInfo: any;
    private config: any;
    private statusBarItem: HTMLElement | null = null;

    async onload() {
        console.log('VEGETA: Plugin loading started');
        
        // Detect device type and get optimal configuration
        this.deviceInfo = useDeviceType();
        this.config = getOptimalConfig(this.deviceInfo);
        
        console.log(`VEGETA: Detected device type: ${this.deviceInfo.type}`);
        console.log('VEGETA: Device config:', this.config);
        
        await this.logToVaultFile(`VEGETA plugin loading - Device: ${this.deviceInfo.type}, Screen: ${this.deviceInfo.screenWidth}x${this.deviceInfo.screenHeight}`);
        
        // Create status bar item for debugging
        this.statusBarItem = this.addStatusBarItem();
        this.statusBarItem.setText(`VEGETA (${this.deviceInfo.type.toUpperCase()})`);
        
        // Register appropriate view based on device type
        this.app.workspace.onLayoutReady(() => {
            try {
                if (this.deviceInfo.type === 'mobile') {
                    console.log('VEGETA: Registering Mobile Editor View');
                    this.registerView(EDITOR_VIEW_TYPE, (leaf) => new MobileEditorView(leaf, this));
                } else {
                    console.log('VEGETA: Registering PC Editor View');
                    this.registerView(EDITOR_VIEW_TYPE, (leaf) => new PCEditorView(leaf, this));
                }
                
                console.log('VEGETA: View registered successfully');
                this.statusBarItem?.setText(`VEGETA (${this.deviceInfo.type.toUpperCase()}) ✓`);
            } catch (error) {
                console.error('VEGETA: Failed to register view:', error);
                this.logToVaultFile(error);
                this.statusBarItem?.setText(`VEGETA (${this.deviceInfo.type.toUpperCase()}) ✗`);
            }

            // Add ribbon icon with device-specific implementation
            try {
                this.addRibbonIcon('terminal-square', `Open VEGETA‐Terminal (${this.deviceInfo.type.toUpperCase()})`, async () => {
                    await this.setupTerminalView();
                });
                console.log('VEGETA: Ribbon icon added');
            } catch (error) {
                console.error('VEGETA: Failed to add ribbon icon:', error);
                this.logToVaultFile(error);
            }

            // Setup view based on device type
            if (this.deviceInfo.type === 'mobile') {
                this.setupMobileView();
            } else {
                this.setupTerminalView();
            }
        });

        this.addCommand({
            id: "setup-vegeta-terminal",
            name: `Setup VEGETA‐Terminal (${this.deviceInfo.type.toUpperCase()})`,
            callback: async () => {
                await this.setupTerminalView();
            },
        });
    }

    async setupMobileView() {
        try {
            console.log('VEGETA: Mobile setup starting');
            
            // Mobile-specific initialization with device config
            await this.waitForWorkspaceReady();
            await this.logToVaultFile('Mobile: workspace ready');
            
            // Use mobile-optimized delays
            await new Promise(resolve => setTimeout(resolve, this.config.renderDelay));
            await this.logToVaultFile('Mobile: app fully ready');
            
            // Try to setup view with mobile retry mechanism
            const success = await this.setupTerminalViewWithRetry();
            
            if (success) {
                await this.logToVaultFile('Mobile: initialization successful');
                this.statusBarItem?.setText('VEGETA (MOBILE) Ready');
            } else {
                throw new Error('Failed to setup mobile view after retries');
            }
        } catch (error) {
            console.error('VEGETA: Mobile setup error:', error);
            await this.logToVaultFile(error);
            this.statusBarItem?.setText('VEGETA (MOBILE) Failed');
        }
    }

    async setupTerminalViewWithRetry(): Promise<boolean> {
        for (let i = 0; i < this.config.maxRetries; i++) {
            try {
                await this.setupTerminalView();
                return true;
            } catch (error) {
                console.warn(`VEGETA: Setup attempt ${i + 1} failed:`, error);
                await this.logToVaultFile(`Retry ${i + 1}: ${error.message}`);
                
                if (i < this.config.maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * Math.pow(2, i)));
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
            const maxAttempts = 50;
            
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
        console.log(`VEGETA: setupTerminalView called for ${this.deviceInfo.type}`);
        try {
            const { workspace } = this.app;
            workspace.detachLeavesOfType(EDITOR_VIEW_TYPE);

            // Device-specific pane selection
            let targetLeaf;
            if (this.deviceInfo.type === 'mobile') {
                console.log('VEGETA: Creating mobile leaf');
                await this.logToVaultFile('Mobile: attempting to create leaf');
                
                // Mobile: Simplified leaf creation
                const existingLeaves = workspace.getLeavesOfType(EDITOR_VIEW_TYPE);
                if (existingLeaves.length > 0) {
                    targetLeaf = existingLeaves[0];
                } else {
                    targetLeaf = workspace.getLeaf('tab') || workspace.getLeaf(true);
                }
            } else {
                // PC: Force VEGETA to open in right pane
                targetLeaf = workspace.getRightLeaf(false);
            }
            
            if (!targetLeaf) {
                throw new Error('Failed to create or get leaf');
            }
            
            console.log('VEGETA: Setting view state');
            await targetLeaf.setViewState({
                type: EDITOR_VIEW_TYPE,
                active: true,
            });
            console.log('VEGETA: View state set successfully');
            
            // Add device-specific stabilization delay
            await new Promise(resolve => setTimeout(resolve, this.config.renderDelay));

            workspace.revealLeaf(targetLeaf);
            workspace.setActiveLeaf(targetLeaf, { focus: true });
            console.log('VEGETA: Terminal view setup completed');
        } catch (error) {
            console.error('VEGETA: Setup error:', error);
            await this.logToVaultFile(error);
        }
    }

    async logToVaultFile(error: Error | string): Promise<void> {
        try {
            const timestamp = new Date().toISOString();
            const deviceType = this.deviceInfo?.type || 'unknown';
            const errorMessage = error instanceof Error ? 
                `${error.name}: ${error.message}\nStack: ${error.stack}` : 
                String(error);
            const logEntry = `[${timestamp}] [VEGETA-${deviceType.toUpperCase()}] ERROR:\n${errorMessage}\n\n`;
            
            // Ensure log directory exists
            const logDir = normalizePath('90_Log');
            const logPath = normalizePath(`${logDir}/vegeta-${deviceType}.log`);
            
            try {
                await this.app.vault.adapter.stat(logDir);
            } catch {
                await this.app.vault.adapter.mkdir(logDir);
            }
            
            // Append to device-specific log file
            await this.app.vault.adapter.append(logPath, logEntry);
        } catch (logError) {
            console.error('VEGETA: Failed to write to vault log:', logError);
        }
    }

    onunload() {
        console.log('VEGETA plugin unloaded');
        this.app.workspace.detachLeavesOfType(EDITOR_VIEW_TYPE);
        if (this.statusBarItem) {
            this.statusBarItem.remove();
        }
    }
}

export default VegetaTerminalPlugin;
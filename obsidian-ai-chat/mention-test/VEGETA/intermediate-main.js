"use strict";

const { Plugin, ItemView, WorkspaceLeaf } = require("obsidian");

const CHAT_VIEW_TYPE = "conductor-chat-view";

class ChatView extends ItemView {
    constructor(leaf) {
        super(leaf);
    }

    getViewType() {
        return CHAT_VIEW_TYPE;
    }

    getDisplayText() {
        return "Conductor Chat";
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("div", { 
            text: "Conductor Multi-LLM Chat Interface",
            cls: "conductor-placeholder"
        });
        
        // Add basic chat interface
        const chatDiv = container.createEl("div", { cls: "chat-container" });
        chatDiv.createEl("h3", { text: "Chat Interface" });
        
        const inputDiv = chatDiv.createEl("div", { cls: "input-container" });
        const textarea = inputDiv.createEl("textarea", { 
            placeholder: "Type your message here...",
            cls: "chat-input"
        });
        const button = inputDiv.createEl("button", { 
            text: "Send",
            cls: "chat-button"
        });
        
        button.onclick = () => {
            const message = textarea.value;
            if (message.trim()) {
                const messageDiv = chatDiv.createEl("div", { cls: "message" });
                messageDiv.createEl("strong", { text: "You: " });
                messageDiv.createSpan({ text: message });
                textarea.value = "";
                
                // Mock response
                setTimeout(() => {
                    const responseDiv = chatDiv.createEl("div", { cls: "message response" });
                    responseDiv.createEl("strong", { text: "Assistant: " });
                    responseDiv.createSpan({ text: `Echo: ${message}` });
                }, 500);
            }
        };
    }

    async onClose() {
        // Clean up if needed
    }
}

class ConductorPlugin extends Plugin {
    async onload() {
        console.log("Conductor Plugin loaded!");
        
        // Register the custom view
        this.registerView(
            CHAT_VIEW_TYPE,
            (leaf) => new ChatView(leaf)
        );
        
        // Add ribbon icon
        this.addRibbonIcon("message-circle", "Open Conductor Chat", () => {
            this.activateView();
        });

        // Add command
        this.addCommand({
            id: "open-chat-view",
            name: "Open Chat View",
            callback: () => {
                this.activateView();
            },
        });
    }

    async onunload() {
        console.log("Conductor Plugin unloaded!");
    }

    async activateView() {
        const { workspace } = this.app;
        
        let leaf = null;
        const leaves = workspace.getLeavesOfType(CHAT_VIEW_TYPE);

        if (leaves.length > 0) {
            // A leaf with our view already exists, use that
            leaf = leaves[0];
        } else {
            // Our view could not be found in the workspace, create a new leaf
            // in the right sidebar for it
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: CHAT_VIEW_TYPE, active: true });
        }

        // "Reveal" the leaf in case it is in a collapsed sidebar
        workspace.revealLeaf(leaf);
    }
}

module.exports = ConductorPlugin;
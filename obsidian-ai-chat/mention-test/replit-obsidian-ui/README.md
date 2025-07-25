# Obsidian GOKU & VEGETA Plugin UI Development

This is a Replit-optimized development environment for testing and developing the UI components of the Obsidian GOKU and VEGETA plugins.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access UI**
   - Click the "Expose this port" button (🌐) in Replit
   - Or go to `https://your-repl-name.your-username.repl.co`

## 🎯 Features

### 🟠 GOKU (AI Chat Interface)
- Multi-model support (Gemini 2.5 Pro/Flash)
- Real-time typing effects
- Message history with timestamps
- Responsive chat bubbles
- Orange gradient theme

### 🔵 VEGETA (Terminal Interface)
- Terminal-style command interface
- Real-time command execution simulation
- Log export functionality
- System/error message differentiation
- Blue gradient theme

### 🔗 Integration
- Bi-directional communication simulation
- Real-time command forwarding from GOKU to VEGETA
- Connection status monitoring
- Synchronized logging

## 🛠 Technical Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Development**: Replit-optimized configuration

## 📁 Project Structure

```
src/
├── components/
│   ├── ConductorPanel.tsx    # Main layout component
│   ├── GOKU.tsx             # Chat interface
│   └── VEGETA.tsx           # Terminal interface
├── hooks/
│   └── useTypingEffect.ts   # Typing animation hook
├── lib/
│   └── utils.ts             # Utility functions
├── main.tsx                 # App entry point
└── index.css               # Global styles
```

## 🎨 Customization

### Color Themes
- **GOKU**: Orange gradient (`#ff9500` → `#ff6b00`)
- **VEGETA**: Blue gradient (`#4f46e5` → `#3730a3`)
- **Obsidian**: Dark theme (`#1e1e1e`, `#2d2d2d`)

### Configuration
- Port: 5173 (configured for Replit)
- Host: 0.0.0.0 (allows external access)
- HMR: Enabled for fast development

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📱 Mobile Support

The UI is fully responsive and works on:
- Desktop browsers
- Mobile devices
- Replit mobile app

## 🌐 Deployment

This project is configured for Replit deployment with automatic port exposure and static serving.

## 💡 Usage Tips

1. **Connection Toggle**: Use the Connect/Disconnect button to simulate plugin communication
2. **Info Panel**: Click the info button (ℹ️) to see feature details
3. **Export Logs**: Use VEGETA's export button to download terminal logs
4. **Model Selection**: Switch between AI models in GOKU for different responses

## 🧪 Testing GOKU → VEGETA Communication

1. Type a message in GOKU
2. Select an AI model
3. Send the message
4. Watch VEGETA receive and process the commands
5. Check browser console for detailed communication logs
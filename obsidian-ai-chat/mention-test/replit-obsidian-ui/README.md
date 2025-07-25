# 🎯 Obsidian GOKU & VEGETA プラグイン統合開発環境

**Replit最適化されたObsidian GOKUとVEGETAプラグインのUI開発・テスト環境**

このプロジェクトでは、ObsidianプラグインGOKU（AIチャット）とVEGETA（ターミナル）の両方を**単一のポート（5173）**で統合的に開発・テストできます。

## 🚀 クイックスタート

### 1. 開発サーバー起動
```bash
npm run dev
```

### 2. プレビューアクセス
- Replitで🌐マークをクリックしてUI確認
- ポート5173で自動的にExposeされます
- 左右分割でGOKU（AIチャット）とVEGETA（ターミナル）が同時表示

### 3. 基本操作
- **GOKU**: メッセージ入力 → モデル選択 → 送信
- **VEGETA**: コマンド入力 → Enter実行
- **統合テスト**: GOKU→VEGETA間のリアルタイム通信確認

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

## 📁 プロジェクト構成

```
replit-obsidian-ui/
├── src/                          # メインUI開発ディレクトリ
│   ├── components/
│   │   ├── ConductorPanel.tsx    # 統合レイアウト（左右分割）
│   │   ├── GOKU.tsx             # AIチャットインターフェース
│   │   └── VEGETA.tsx           # ターミナルインターフェース
│   ├── hooks/
│   │   └── useTypingEffect.ts   # タイピングアニメーション
│   ├── lib/
│   │   └── utils.ts             # ユーティリティ関数
│   ├── main.tsx                 # アプリエントリーポイント
│   └── index.css               # グローバルスタイル
├── plugins/                     # プラグインソース管理
│   ├── GOKU/                   # GOKUプラグイン設定
│   │   ├── manifest.json       # Obsidianプラグイン設定
│   │   └── package.json        # 依存関係
│   └── VEGETA/                 # VEGETAプラグイン設定
│       ├── manifest.json       # Obsidianプラグイン設定
│       └── package.json        # 依存関係
├── .replit                      # Replit設定（自動起動）
├── vite.config.ts              # Vite設定（ポート5173）
└── package.json                # メイン依存関係
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

## 🧪 GOKU → VEGETA 通信テスト手順

1. **GOKU側**: メッセージ入力 + モデル選択
2. **送信**: 送信ボタンクリック
3. **VEGETA側**: コマンド自動受信・実行確認
4. **ログ確認**: ブラウザコンソールで詳細通信ログ
5. **Export**: VEGETAのログExport機能でファイル出力

## 🔄 開発ワークフロー

### UI修正・確認
1. `src/components/` でコンポーネント編集
2. 自動リロードでリアルタイム確認
3. 両プラグインUI同時テスト

### プラグイン設定変更
1. `plugins/GOKU/` または `plugins/VEGETA/` で設定編集
2. manifest.json更新
3. 実際のObsidianプラグインへの適用準備

### Replit最適化済み機能
- ✅ ポート5173自動Expose
- ✅ Hot Module Replacement
- ✅ モバイル対応レスポンシブ
- ✅ ダークテーマ（Obsidian風）
- ✅ 統合開発環境レイアウト

---

**📝 Usage**: Replitで`npm run dev`実行後、🌐マークからUI確認
# Mermaid Editor GenAI

Mermaid Editor GenAIは、Mermaidダイアグラムを生成および編集するためのWebアプリケーションです。Google Generative AI（Gemini）を使用して、指示に基づいてMermaidコードを自動的に更新します。

## 機能

- **コードエディタ**：Mermaidコードを直接編集できます。
- **履歴機能**：UndoおよびRedoボタンで変更履歴を管理します。
- **クリア機能**：エディタの内容をクリアします。
- **コピー機能**：エディタの内容をクリップボードにコピーします。
- **自動更新機能**：指示を入力するとGoogle Generative AIを使用してMermaidコードを更新します。
- **プレビュー機能**：Mermaidコードのプレビューをリアルタイムで表示します。
- **リサイズ機能**：エディタとプレビューの幅を調整できます。
- **ズーム機能**：プレビュー画面でダイアグラムをズームインまたはズームアウトできます。
- **パン機能**：プレビュー画面でダイアグラムをドラッグして移動できます。
- **ファイルアップロード機能**：単一または複数のファイル、フォルダをアップロードしてダイアグラムを生成または更新します。
- **ダイアグラム生成**：アップロードされたファイルに基づいて、新しいシーケンス図、クラス図、またはフローチャートを生成します。
- **ダイアグラム更新**：既存のダイアグラムをアップロードされたファイルの内容に基づいて更新します。
- **ダークモード**: ライトモードとダークモードを切り替えることができます。

## 使用技術

- Next.js
- React
- TypeScript
- Tailwind CSS
- CodeMirror
- Google Generative AI (Gemini)
- Mermaid.js
- Lucide React (アイコン用)

## 環境構築

### 依存関係のインストール

```bash
npm install
```

### 環境変数の設定

`GEMINI_API_KEY` を設定する必要があります。以下のように`.env.local`ファイルを作成して設定します。

```plaintext
GEMINI_API_KEY=YOUR_API_KEY
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

### ビルド

```bash
npm run build
```

### プロダクションモードでの起動

```bash
npm start
```

## プロジェクト構成

- `components/CodeEditor.tsx`：Mermaidコードを編集するためのエディタコンポーネント。
- `components/ErrorDialog.tsx`：エラーダイアログコンポーネント。
- `components/FileUpload.tsx`：ファイルアップロード用のコンポーネント。
- `components/GeminiInput.tsx`：Google Generative AIに指示を送るための入力コンポーネント。
- `components/LoadingDialog.tsx`：ローディングダイアログコンポーネント。
- `components/MermaidPreview.tsx`：Mermaidコードのプレビューコンポーネント。
- `components/Resizer.tsx`：エディタとプレビューの幅を調整するためのコンポーネント。
- `components/ThemeToggle.tsx`: ライトモードとダークモードを切り替えるためのコンポーネント。
- `pages/_app.tsx`：アプリケーションのメインエントリーポイント。
- `pages/index.tsx`：ホームページ。
- `pages/api/gemini.ts`：Google Generative AI APIとの通信を行うAPIルート。
- `utils/geminiApi.ts`：フロントエンドからGemini APIを呼び出すためのユーティリティ関数。

## 処理の流れ

### Mermaid Editor GenAIの主な処理の流れを示すフローチャート

```mermaid
graph TD
    A[開始] --> B[初期Mermaidコードの表示]
    B --> C{ユーザーアクション}
    C -->|コード編集| D[コードエディタで編集]
    C -->|Undo/Redo| E[履歴管理]
    C -->|クリア| F[エディタ内容をクリア]
    C -->|コピー| G[クリップボードにコピー]
    C -->|Gemini指示入力| H[Gemini APIにリクエスト]
    C -->|ファイルアップロード| N[Gemini APIにリクエスト]
    H --> I[ローディング表示]
    I --> J{APIレスポンス}
    N --> I
    J -->|成功| K[Mermaidコード更新]
    J -->|エラー| L[エラーダイアログ表示]
    K --> M[プレビュー更新]
    D --> M
    E --> M
    F --> M
    L --> C
    M --> C
```

### `updateMermaidWithGemini`に着目して作成したシーケンス図

```mermaid
sequenceDiagram
  ユーザー->>+Mermaid Editor GenAI: Gemini指示入力
  activate Mermaid Editor GenAI
  Mermaid Editor GenAI->>+pages/index.tsx: handleGeminiUpdate(instruction)
  activate pages/index.tsx
  pages/index.tsx->>+utils/geminiApi.ts: updateMermaidWithGemini(mermaidCode, instruction)
  activate utils/geminiApi.ts
  utils/geminiApi.ts->>+pages/api/gemini: callGeminiAPI('updateMermaid', { currentCode, instruction })
  activate pages/api/gemini
  pages/api/gemini->>+Google Generative AI: model.generateContent(prompt)
  activate Google Generative AI
  Google Generative AI-->>-pages/api/gemini: 更新されたMermaidコード
  deactivate Google Generative AI
  pages/api/gemini-->>-utils/geminiApi.ts: 更新されたMermaidコード
  deactivate pages/api/gemini
  utils/geminiApi.ts-->>-pages/index.tsx: 更新されたMermaidコード
  deactivate utils/geminiApi.ts
  pages/index.tsx->>pages/index.tsx: updateCode(updatedCode)
  pages/index.tsx-->>-Mermaid Editor GenAI: 処理終了
  deactivate pages/index.tsx
  deactivate Mermaid Editor GenAI
```

### `updateMermaidWithGemini`に着目して作成したクラス図

```mermaid
classDiagram
    class FileUpload {
        + onFilesSelected(files: File[], diagramType: DiagramType, updateType: UpdateType, userInstruction: string): void
    }
    class GeminiInput {
        + onSubmit(instruction: string): void
    }
    class Home {
        + handleFilesSelected(): void
        + handleGeminiUpdate(): void
    }
    class updateMermaidWithGemini {
        + currentCode: string
        + instruction: string
    }
    Home --> FileUpload : ファイルアップロードボタンクリック
    Home --> GeminiInput : Gemini指示入力後送信
    Home --> updateMermaidWithGemini : Mermaidコード更新処理呼び出し
    FileUpload --> Home : 選択されたファイル情報を渡す
    GeminiInput --> Home : Geminiへの指示内容を渡す
    updateMermaidWithGemini --> Home : 更新後のMermaidコードを返す
```

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。詳細は`LICENSE`ファイルを参照してください。

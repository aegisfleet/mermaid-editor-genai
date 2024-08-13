import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ErrorDialog from '../components/ErrorDialog';
import FileUpload, { DiagramType, UpdateType } from '../components/FileUpload';
import GeminiInput from '../components/GeminiInput';
import LoadingDialog from '../components/LoadingDialog';
import { generateDiagram, updateDiagramWithFiles, updateMermaidWithGemini } from '../utils/geminiApi';

const MermaidPreview = dynamic(() => import('../components/MermaidPreview'), { ssr: false });

const Home = () => {
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialCode = `graph TD
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
    M --> C`;
    setMermaidCode(initialCode);
    setHistory([initialCode]);
    setCurrentIndex(0);
  }, []);

  const updateCode = (newCode: string) => {
    setMermaidCode(newCode);
    setHistory(prev => [...prev.slice(0, currentIndex + 1), newCode]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setMermaidCode(history[currentIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setMermaidCode(history[currentIndex + 1]);
    }
  };

  const handleClear = () => {
    const clearedCode = '';
    setMermaidCode(clearedCode);
    setHistory(prev => [...prev.slice(0, currentIndex + 1), clearedCode]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleGeminiUpdate = async (instruction: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCode = await updateMermaidWithGemini(mermaidCode, instruction);
      updateCode(updatedCode);
    } catch (error) {
      console.error('Error updating code with Gemini:', error);
      setError('Failed to update code with Gemini. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesSelected = async (files: File[], diagramType: DiagramType, updateType: UpdateType) => {
    setIsLoading(true);
    setError(null);
    try {
      const fileContents = await Promise.all(
        files.map(file => file.text())
      );
      const fileInfos = files.map((file, index) => ({
        name: file.name,
        path: file.webkitRelativePath || file.name,
        content: fileContents[index]
      }));
  
      let newCode: string;
      if (updateType === 'new') {
        newCode = await generateDiagram(fileInfos, diagramType);
      } else {
        newCode = await updateDiagramWithFiles(mermaidCode, fileInfos);
      }
      updateCode(newCode);
    } catch (error) {
      console.error('Error generating/updating diagram:', error);
      setError(`Failed to ${updateType === 'new' ? 'generate' : 'update'} diagram. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Head>
        <title>Mermaid Editor GenAI</title>
      </Head>
      <header className="bg-blue-600 text-white p-4 flex items-center">
        <img src="/favicon.svg" alt="App Icon" className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">Mermaid Editor GenAI</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 bg-white shadow-lg flex flex-col overflow-hidden">
          <FileUpload onFilesSelected={handleFilesSelected} />
          <div className="flex-1 overflow-auto">
            <CodeEditor
              code={mermaidCode}
              onChange={updateCode}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
            />
          </div>
        </div>
        <div className="w-1/2 p-4 bg-white shadow-lg flex flex-col overflow-hidden">
          <MermaidPreview code={mermaidCode} />
        </div>
      </main>
      <footer className="bg-gray-200 p-4">
        <GeminiInput onSubmit={handleGeminiUpdate} />
      </footer>
      <LoadingDialog isOpen={isLoading} />
      <ErrorDialog isOpen={error !== null} message={error || ''} onClose={() => setError(null)} />
    </div>
  );
};

export default Home;

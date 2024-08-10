import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ErrorDialog from '../components/ErrorDialog';
import GeminiInput from '../components/GeminiInput';
import LoadingDialog from '../components/LoadingDialog';
import { updateMermaidWithGemini } from '../utils/geminiApi';

const MermaidPreview = dynamic(() => import('../components/MermaidPreview'), { ssr: false });

const Home = () => {
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialCode = `graph TD
    A[Client] --> B[Load Balancer]
    B --> C[Server1]
    B --> D[Server2]`;
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
        <div className="w-1/2 p-4 bg-white shadow-lg">
          <CodeEditor
            code={mermaidCode}
            onChange={updateCode}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
          />
        </div>
        <div className="w-1/2 p-4 bg-white shadow-lg flex flex-col">
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

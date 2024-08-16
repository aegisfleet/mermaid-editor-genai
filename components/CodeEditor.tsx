import { markdown } from '@codemirror/lang-markdown';
import CodeMirror from '@uiw/react-codemirror';
import React, { useCallback, useEffect, useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onUndo, onRedo, onClear }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const handleChange = useCallback((value: string) => {
    onChange(value);
  }, [onChange]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setCopyStatus('Failed to copy');
    });
  }, [code]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 flex justify-between">
        <div>
          <button onClick={onUndo} className="mr-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Undo</button>
          <button onClick={onRedo} className="mr-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Redo</button>
          <button onClick={onClear} className="px-4 py-2 bg-red-500 dark:bg-red-700 text-white rounded-lg shadow-md hover:bg-red-600 dark:hover:bg-red-600 transition-colors">Clear</button>
        </div>
        <button 
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
        >
          {copyStatus}
        </button>
      </div>
      <CodeMirror
        value={code}
        height="100%"
        extensions={[markdown()]}
        onChange={handleChange}
        className="flex-grow overflow-auto"
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

export default CodeEditor;

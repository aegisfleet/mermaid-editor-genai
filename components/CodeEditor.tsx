import { markdown } from '@codemirror/lang-markdown';
import CodeMirror from '@uiw/react-codemirror';
import React, { useCallback, useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onUndo, onRedo, onClear }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

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
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between items-center">
        <div>
          <button onClick={onUndo} className="mr-2 px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-colors">Undo</button>
          <button onClick={onRedo} className="mr-2 px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-colors">Redo</button>
          <button onClick={onClear} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors">Clear</button>
        </div>
        <button 
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          {copyStatus}
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[markdown()]}
          onChange={handleChange}
          className="border rounded h-full overflow-auto"
        />
      </div>
    </div>
  );
};

export default CodeEditor;

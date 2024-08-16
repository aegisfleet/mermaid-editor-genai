import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';

interface GeminiInputProps {
  onSubmit: (instruction: string) => void;
  clearTrigger: number;
}

const GeminiInput: React.FC<GeminiInputProps> = ({ onSubmit, clearTrigger }) => {
  const [instruction, setInstruction] = useState('');

  const sampleInstructions = [
    "【指示のサンプル】",
    "図の向きを変えて欲しい。",
    "色を付けてカラフルにして欲しい。",
    "表示される文字を英語にして欲しい。",
  ];

  useEffect(() => {
    setInstruction('');
  }, [clearTrigger]);

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (instruction.trim()) {
      onSubmit(instruction.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== sampleInstructions[0]) {
      setInstruction(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        onChange={handleSelectChange}
        className="w-full p-3 rounded-lg shadow-sm mb-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        value={sampleInstructions.includes(instruction) ? instruction : sampleInstructions[0]}
      >
        {sampleInstructions.map((sample, index) => (
          <option key={index} value={sample} className={index === 0 ? "text-gray-500 dark:text-gray-400" : ""}>
            {sample}
          </option>
        ))}
      </select>
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter instructions for Gemini..."
        className="w-full p-3 rounded-lg shadow-sm mb-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        rows={3}
      />
      <button 
        type="submit" 
        className={`w-full p-3 rounded-lg shadow-md transition-colors ${
          instruction.trim() 
            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
        }`} 
        disabled={!instruction.trim()}
      >
        Update Mermaid (Ctrl + Enter)
      </button>
    </form>
  );
};

export default GeminiInput;

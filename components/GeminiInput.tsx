import React, { FormEvent, KeyboardEvent, useState } from 'react';

interface GeminiInputProps {
  onSubmit: (instruction: string) => void;
}

const GeminiInput: React.FC<GeminiInputProps> = ({ onSubmit }) => {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (instruction.trim()) {
      onSubmit(instruction.trim());
      setInstruction('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter instructions for Gemini..."
        className="w-full p-3 border rounded-lg shadow-sm"
        rows={3}
      />
      <button 
        type="submit" 
        className={`mt-2 w-full p-3 rounded-lg shadow-md transition-colors ${instruction.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} 
        disabled={!instruction.trim()}
      >
        Update Mermaid (Ctrl + Enter)
      </button>
    </form>
  );
};

export default GeminiInput;

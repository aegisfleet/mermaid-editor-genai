import React, { useCallback, useEffect, useState } from 'react';

interface ResizerProps {
  onResize: (leftWidth: number) => void;
  initialLeftWidth?: number;
}

const Resizer: React.FC<ResizerProps> = ({ onResize, initialLeftWidth = 50 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const container = document.getElementById('resizable-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    onResize(Math.max(10, Math.min(90, newLeftWidth)));
  }, [isDragging, onResize]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className="flex items-center justify-center w-4 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors"
      onMouseDown={handleMouseDown}
    >
      <div className="w-0.5 h-8 bg-gray-400" />
    </div>
  );
};

export default Resizer;

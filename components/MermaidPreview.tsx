import mermaid from 'mermaid';
import React, { useEffect, useRef, useState } from 'react';

interface MermaidPreviewProps {
  code: string;
}

const MermaidPreview: React.FC<MermaidPreviewProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');
  const [scale, setScale] = useState<number>(1);
  const [dragging, setDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    let isMounted = true;
    const renderMermaid = async () => {
      mermaid.initialize({ 
        startOnLoad: false,
        theme: isDarkMode ? 'dark' : 'default'
      });

      try {
        const { svg } = await mermaid.render('mermaid-diagram', code);
        if (isMounted) {
          setSvgCode(svg);
          setError(null);
        }
      } catch (error: any) {
        console.error('Mermaid rendering error:', error);
        if (isMounted) {
          setSvgCode('');
          setError(error.message || 'Error rendering diagram');
        }
      }
    };

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [code, isDarkMode]);

  const handleZoom = (zoomIn: boolean) => {
    setScale((prevScale) => {
      const newScale = zoomIn ? prevScale * 1.2 : prevScale / 1.2;
      return Math.max(0.1, Math.min(newScale, 5));
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - startPosition.x, y: e.clientY - startPosition.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between">
        <div>
          <button 
            onClick={() => handleZoom(false)} 
            className="mr-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Zoom Out
          </button>
          <button 
            onClick={() => handleZoom(true)} 
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Zoom In
          </button>
        </div>
        <div>
          <button 
            onClick={handleResetZoom} 
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset Zoom
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-grow overflow-auto p-4 border rounded dark:border-gray-700"
        style={{ 
          maxHeight: 'calc(100vh - 200px)', 
          cursor: dragging ? 'grabbing' : 'grab', 
          backgroundColor: isDarkMode ? 'var(--bg-dark, #1a202c)' : 'var(--bg-light, white)'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {error ? (
          <div className="text-red-500 dark:text-red-400">
            <p>Error rendering diagram:</p>
            <pre>{error}</pre>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: svgCode }}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'top left',
              transition: dragging ? 'none' : 'transform 0.2s',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MermaidPreview;

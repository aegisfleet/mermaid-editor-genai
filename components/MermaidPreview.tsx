import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';

interface MermaidPreviewProps {
  code: string;
}

const MermaidPreview: React.FC<MermaidPreviewProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const renderMermaid = async () => {
      if (typeof window === 'undefined') return;

      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({ startOnLoad: false });

      try {
        const { svg } = await mermaid.render('mermaid-diagram', code);
        if (isMounted) {
          setSvgCode(svg);
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (isMounted) {
          setSvgCode('<p>Error rendering diagram</p>');
        }
      }
    };

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [code]);

  return (
    <div 
      ref={containerRef} 
      className="flex-grow p-4" 
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
};

export default dynamic(() => Promise.resolve(MermaidPreview), { ssr: false });

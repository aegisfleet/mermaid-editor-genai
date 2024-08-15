import { DiagramType } from "../components/FileUpload";

interface FileInfo {
  name: string;
  path: string;
  content: string | null;
}

async function callGeminiAPI(action: string, data: any) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const result = await response.json();
  return result.result;
}

export const updateMermaidWithGemini = async (currentCode: string, instruction: string) => {
  return callGeminiAPI('updateMermaid', { currentCode, instruction });
};

export const generateDiagram = async (fileInfos: FileInfo[], diagramType: DiagramType, userInstruction: string) => {
  return callGeminiAPI('generateDiagram', { fileInfos, diagramType, userInstruction });
};

export const updateDiagramWithFiles = async (currentCode: string, fileInfos: FileInfo[], userInstruction: string) => {
  return callGeminiAPI('updateDiagram', { currentCode, fileInfos, userInstruction });
};

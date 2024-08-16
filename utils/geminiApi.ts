import { DiagramType } from "../components/FileUpload";
import { FileInfo } from "../types/types";

interface GeminiApiResponse {
  result: string;
}

type GeminiAction = 'updateMermaid' | 'generateDiagram' | 'updateDiagram';

async function callGeminiAPI<T>(action: GeminiAction, data: T): Promise<string> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const result: GeminiApiResponse = await response.json();
  return result.result;
}

export const updateMermaidWithGemini = async (currentCode: string, instruction: string): Promise<string> => {
  return callGeminiAPI('updateMermaid', { currentCode, instruction });
};

export const generateDiagram = async (fileInfos: FileInfo[], diagramType: DiagramType, userInstruction: string): Promise<string> => {
  return callGeminiAPI('generateDiagram', { fileInfos, diagramType, userInstruction });
};

export const updateDiagramWithFiles = async (currentCode: string, fileInfos: FileInfo[], userInstruction: string): Promise<string> => {
  return callGeminiAPI('updateDiagram', { currentCode, fileInfos, userInstruction });
};

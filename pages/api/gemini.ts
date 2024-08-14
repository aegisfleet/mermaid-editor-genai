import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from 'next';
import { DiagramType } from "../../components/FileUpload";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action, data } = req.body;

  try {
    let result;
    switch (action) {
      case 'updateMermaid':
        result = await updateMermaidWithGemini(data.currentCode, data.instruction);
        break;
      case 'generateDiagram':
        result = await generateDiagram(data.fileInfos, data.diagramType);
        break;
      case 'updateDiagram':
        result = await updateDiagramWithFiles(data.currentCode, data.fileInfos);
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

interface FileInfo {
  name: string;
  path: string;
  content: string | null;
}

const updateMermaidWithGemini = async (currentCode: string, instruction: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
以下の指示に基づいて、Mermaidコードを更新する。

仕様:
- Mermaidの書式を守る。
- インデントを変更しない。
- 更新されたMermaidコードのみを返す。

指示:
${instruction}

現在のMermaidコード:
${currentCode}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let updatedCode = response.text();

    updatedCode = updatedCode.replace(/```mermaid/g, '').replace(/```/g, '').trim();

    return updatedCode;
  } catch (error) {
    console.error("Error updating Mermaid with Gemini:", error);
    throw error;
  }
};

const generateDiagram = async (fileInfos: FileInfo[], diagramType: DiagramType) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const diagramTypeMap = {
    sequence: 'シーケンス図',
    class: 'クラス図',
    flowchart: 'フローチャート'
  };

  const fileStructure = fileInfos.map(file => `${file.path}: ${file.content ? '(content available)' : '(no content)'}`).join('\n');

  const prompt = `
以下のファイル構造とコンテンツを解析し、${diagramTypeMap[diagramType]}を生成してください。

仕様:
- Mermaidの${diagramTypeMap[diagramType]}形式を使用する。
- この図はコンテンツの内容を深く理解するために作成され、簡素で分かりやすい表現を用いる。
- 図の中には補足を日本語で記載する。
- 関連の無いファイルの記載は省略する。
- 生成されたMermaidコードのみを返す。

ファイル構造:
${fileStructure}

ファイルコンテンツ:
${fileInfos.filter(file => file.content).map(file => `\`\`\`file:${file.path}\n${file.content}\n\`\`\``).join('\n\n')}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let diagram = response.text();

    diagram = diagram.replace(/```mermaid/g, '').replace(/```/g, '').trim();

    return diagram;
  } catch (error) {
    console.error(`Error generating ${diagramType} diagram with Gemini:`, error);
    throw error;
  }
};

const updateDiagramWithFiles = async (currentCode: string, fileInfos: FileInfo[]) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const fileStructure = fileInfos.map(file => `${file.path}: ${file.content ? '(content available)' : '(no content)'}`).join('\n');

  const prompt = `
以下のファイル構造とコンテンツを解析し、現在のMermaidコードを更新してください。

仕様:
- 現在のMermaidコードを基に、新しい情報を統合して図を更新する。
- 更新されたMermaidコードのみを返す。

現在のMermaidコード:
${currentCode}

ファイル構造:
${fileStructure}

ファイルコンテンツ:
${fileInfos.filter(file => file.content).map(file => `\`\`\`file:${file.path}\n${file.content}\n\`\`\``).join('\n\n')}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let updatedDiagram = response.text();

    updatedDiagram = updatedDiagram.replace(/```mermaid/g, '').replace(/```/g, '').trim();

    return updatedDiagram;
  } catch (error) {
    console.error(`Error updating diagram with Gemini:`, error);
    throw error;
  }
};

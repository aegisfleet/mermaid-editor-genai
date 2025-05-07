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
        result = await generateDiagram(data.fileInfos, data.diagramType, data.userInstruction);
        break;
      case 'updateDiagram':
        result = await updateDiagramWithFiles(data.currentCode, data.fileInfos, data.userInstruction);
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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-05-06" });

  const prompt = `
以下の指示に基づいて、Mermaidコードを更新する。

仕様:
- Mermaidの書式を守る。
- インデントを変更しない。
- 更新されたMermaidコードのみを返す。

指示:
${instruction}

現在のMermaidコード:
\`\`\`mermaid
${currentCode}
\`\`\`
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

const generateDiagram = async (fileInfos: FileInfo[], diagramType: DiagramType, userInstruction: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-05-06" });

  const diagramTypeMap = {
    sequence: 'シーケンス図',
    class: 'クラス図',
    flowchart: 'フローチャート'
  };

  let specificationPrompt;
  if (userInstruction) {
    specificationPrompt = `- ${userInstruction}の呼び出し元を解析し、処理の呼び出し関係を詳細にダイアグラムに反映させたい。
- 具体的な処理名を記載する。
- ${userInstruction}に関係の無い処理は記載しない。`;
  } else {
    specificationPrompt = `-簡素で分かりやすい表現を用いる。
- 関連の無いファイルの記載は省略する。`;
  }

  const prompt = `
以下のソースコードを解析し、${diagramTypeMap[diagramType]}を生成してください。

仕様:
- Mermaidの${diagramTypeMap[diagramType]}形式を使用する。
- このダイアグラムは不具合の解析やコードの理解を深めるために作成される。
${specificationPrompt}
- 図の中には補足を日本語で記載する。
- なるべくUI上の機能名を記載する。
- 生成されたMermaidコードのみを返す。

ソースコード:
${fileInfos.filter(file => file.content).map(file => `\`\`\`file:${file.path}\n${file.content}\n\`\`\``).join('\n\n')}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let diagram = response.text();

    diagram = diagram.replace(/```mermaid/g, '').replace(/```/g, '').trim();

    return diagram;
  } catch (error) {
    console.error('Error generating %s diagram with Gemini:', diagramType, error);
    throw error;
  }
};

const updateDiagramWithFiles = async (currentCode: string, fileInfos: FileInfo[], userInstruction: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-05-06" });

  const prompt = `
以下のソースコードを解析し、現在のMermaidコードを更新してください。

仕様:
- ダイアグラムの形式は変更しない。
- 現在のMermaidコードを基に、更新された部分を図に反映させる。
- 更新されたMermaidコードのみを返す。

現在のMermaidコード:
\`\`\`mermaid
${currentCode}
\`\`\`

ソースコード:
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

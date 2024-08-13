import React, { useRef, useState } from 'react';

export type DiagramType = 'sequence' | 'class' | 'flowchart';
export type UpdateType = 'new' | 'update';

interface FileUploadProps {
  onFilesSelected: (files: File[], diagramType: DiagramType, updateType: UpdateType) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [diagramType, setDiagramType] = useState<DiagramType>('sequence');
  const [updateType, setUpdateType] = useState<UpdateType>('new');

  const MAX_FILE_SIZE = 20 * 1024;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesSelected(files, diagramType, updateType);
  };

  const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [];
    const items = event.target.files;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.size <= MAX_FILE_SIZE && item.webkitRelativePath && !item.webkitRelativePath.includes('.git/')) {
          files.push(item);
        }
      }

      if (files.length !== items.length) {
        alert('20KBを超えるファイルは除外されました。');
      }
    }

    onFilesSelected(files, diagramType, updateType);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFolderButtonClick = () => {
    folderInputRef.current?.click();
  };

  return (
    <div className="mb-4 flex items-center flex-wrap">
      <select
        value={updateType}
        onChange={(e) => setUpdateType(e.target.value as UpdateType)}
        className="mr-2 px-4 py-2 border rounded-lg shadow-sm"
      >
        <option value="new">新規作成</option>
        <option value="update">現在の図を更新</option>
      </select>
      {updateType === 'new' && (
        <select
          value={diagramType}
          onChange={(e) => setDiagramType(e.target.value as DiagramType)}
          className="mr-2 px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="sequence">シーケンス図</option>
          <option value="class">クラス図</option>
          <option value="flowchart">フローチャート</option>
        </select>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderChange}
        className="hidden"
        {...{ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>}
      />
      <button
        onClick={handleFileButtonClick}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors mr-2"
      >
        Upload Files
      </button>
      <button
        onClick={handleFolderButtonClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
      >
        Upload Folder
      </button>
    </div>
  );
};

export default FileUpload;
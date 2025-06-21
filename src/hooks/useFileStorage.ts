
import { useState, useEffect } from 'react';

interface StoredFile {
  name: string;
  data: string;
  type: string;
  uploadDate: string;
}

export const useFileStorage = (storageKey: string) => {
  const [files, setFiles] = useState<StoredFile[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedFiles = JSON.parse(stored);
        setFiles(Array.isArray(parsedFiles) ? parsedFiles : []);
      }
    } catch (error) {
      console.error(`Error loading files from ${storageKey}:`, error);
      setFiles([]);
    }
  }, [storageKey]);

  const saveFile = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileData: StoredFile = {
            name: file.name,
            data: reader.result as string,
            type: file.type,
            uploadDate: new Date().toISOString()
          };
          
          const updatedFiles = [fileData, ...files.filter(f => f.name !== file.name)];
          setFiles(updatedFiles);
          localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
          console.log(`File ${file.name} saved successfully`);
          resolve();
        } catch (error) {
          console.error('Error saving file:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const getLatestFile = (): StoredFile | null => {
    return files.length > 0 ? files[0] : null;
  };

  const deleteFile = (fileName: string) => {
    const updatedFiles = files.filter(f => f.name !== fileName);
    setFiles(updatedFiles);
    localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
  };

  return {
    files,
    saveFile,
    getLatestFile,
    deleteFile
  };
};

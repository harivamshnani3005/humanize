import React, { useCallback, useState } from 'react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelected: (file: FileData) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file) return;
    
    // Basic size validation (e.g., 20MB limit for API safety in this demo)
    if (file.size > 20 * 1024 * 1024) {
        alert("File is too large. Please upload a file smaller than 20MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // extract base64 data (remove data:mime/type;base64, prefix)
      const base64Data = result.split(',')[1];
      
      onFileSelected({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: base64Data,
        size: file.size
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled, onFileSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 
          isDragging ? 'border-primary-500 bg-primary-50 scale-[1.02]' : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-primary-300'}
      `}
    >
      <input
        type="file"
        onChange={(e) => e.target.files && processFile(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        disabled={disabled}
        accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.webp" 
      />
      
      <div className="text-center p-6 pointer-events-none">
        <div className={`mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center ${isDragging ? 'bg-primary-200 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-900">
          {isDragging ? 'Drop it here!' : 'Drag & Drop your file here'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports PDF, Word, Text, Images (OCR)
        </p>
        <button className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${disabled ? 'bg-gray-200 text-gray-400' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'}`}>
          Browse Files
        </button>
      </div>
    </div>
  );
};
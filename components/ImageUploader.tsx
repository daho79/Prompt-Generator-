import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleDrag = useCallback((event: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isProcessing) {
        setIsDragging(dragging);
    }
  }, [isProcessing]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    handleDrag(event, false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageUpload(event.dataTransfer.files[0]);
    }
  }, [handleDrag, onImageUpload]);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const dragOverClass = isDragging ? 'border-indigo-500 bg-slate-700/50 scale-105' : 'border-slate-600';

  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-full p-6 text-center cursor-pointer"
      onClick={handleClick}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragOver={(e) => handleDrag(e, true)}
      onDrop={handleDrop}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed ${dragOverClass} rounded-lg transition-all duration-300`}>
        <UploadIcon className={`w-16 h-16 mb-4 text-slate-400 transition-transform duration-300 ${isDragging ? 'scale-110 -translate-y-2' : ''}`} />
        <h3 className="text-xl font-semibold text-slate-100">
          <span className="text-primary">Click to upload</span> or drag and drop
        </h3>
        <p className="text-slate-400 mt-2">Supports JPG, PNG, WEBP, etc.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

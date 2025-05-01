
import { useRef, useState } from "react";
import { Upload, Image } from "lucide-react";

interface UploadInterfaceProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadInterface({ onFileSelect }: UploadInterfaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Create a synthetic change event
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileSelect(event);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed ${isDragging ? 'border-apocalypse-terminal' : 'border-white/20'} rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-apocalypse-terminal/50`}
      onClick={handleUploadClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*" 
        onChange={onFileSelect}
      />
      
      <Upload className="mx-auto mb-3 text-white/60" size={40} />
      <h3 className="text-xl text-white mb-2">Upload Your Image</h3>
      <p className="text-white/60 mb-4">
        Click or drag and drop your image here
      </p>
      <button 
        className="px-4 py-2 bg-apocalypse-gray/80 hover:bg-apocalypse-gray text-white rounded-md transition-colors inline-flex items-center space-x-2"
      >
        <Image size={16} />
        <span>Select Image</span>
      </button>
    </div>
  );
}


import { Camera, X, CircleDot } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface ImagePreviewProps {
  imageUrl: string;
  remainingGenerations: number;
  onClearImage: () => void;
  onChooseDifferent: () => void;
  onProcessImage: () => void;
}

export default function ImagePreview({ 
  imageUrl, 
  remainingGenerations, 
  onClearImage, 
  onChooseDifferent, 
  onProcessImage 
}: ImagePreviewProps) {
  const { totalGenerations } = useUser();
  
  return (
    <div className="text-center">
      <div className="relative w-full max-w-md mx-auto mb-4">
        <img 
          src={imageUrl} 
          alt="Selected Image" 
          className="w-full h-auto rounded-lg border border-white/20"
        />
        <button 
          onClick={onClearImage}
          className="absolute top-2 right-2 bg-apocalypse-darkgray/80 hover:bg-apocalypse-darkgray p-1 rounded-full text-white/80 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        {totalGenerations > 1 && (
          <div className="flex items-center space-x-2 text-white/80 mb-4 sm:mb-0">
            <CircleDot size={16} />
            <span>{remainingGenerations} generations remaining</span>
          </div>
        )}
        
        <button 
          onClick={onChooseDifferent}
          className="px-4 py-2 bg-apocalypse-gray/80 hover:bg-apocalypse-gray text-white rounded-md transition-colors inline-flex items-center space-x-2"
        >
          <Camera size={16} />
          <span>Choose Different Image</span>
        </button>
        
        <button 
          onClick={onProcessImage}
          className="px-6 py-2 bg-apocalypse-green/80 hover:bg-apocalypse-green text-black rounded-md transition-colors font-medium"
        >
          Transform Image
        </button>
      </div>
    </div>
  );
}


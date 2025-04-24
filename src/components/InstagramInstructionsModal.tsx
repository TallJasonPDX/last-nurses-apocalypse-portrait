
import { Instagram } from "lucide-react";

interface InstructionModalProps {
  onClose: () => void;
  onOpenInstagram: () => void;
}

export const InstagramInstructionsModal = ({ onClose, onOpenInstagram }: InstructionModalProps) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="glass rounded-lg max-w-md w-full p-6 animate-scale-in">
      <h3 className="text-xl text-white mb-4">Share to Instagram</h3>
      <ol className="text-white/80 space-y-3 list-decimal list-inside mb-6">
        <li>The image has been saved to your device</li>
        <li>Open Instagram app</li>
        <li>Tap <span className="text-apocalypse-terminal">+</span> to create a new post</li>
        <li>Select the downloaded image from your gallery</li>
        <li>Tag <span className="font-mono bg-apocalypse-darkgray/50 px-1 rounded">@replacern</span> in your post</li>
        <li>Add <span className="font-mono bg-apocalypse-darkgray/50 px-1 rounded">#LastNurses</span> to get featured</li>
      </ol>
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <button 
          onClick={onOpenInstagram} 
          className="w-full px-4 py-3 bg-gradient-to-r from-[#405DE6] via-[#5B51D8] to-[#833AB4] text-white rounded-md font-medium flex items-center justify-center space-x-2"
        >
          <Instagram size={18} />
          <span>Open Instagram</span>
        </button>
        <button 
          onClick={onClose} 
          className="w-full px-4 py-3 bg-apocalypse-darkgray text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

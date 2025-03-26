
import { X, Instagram } from "lucide-react";
import { API } from "@/services/api";

interface LimitReachedModalProps {
  onClose: () => void;
}

export default function LimitReachedModal({ onClose }: LimitReachedModalProps) {
  const handleInstagramLogin = () => {
    API.connectInstagram();
    // We'll close the modal since the Instagram auth will open in a popup
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative glass rounded-lg max-w-md w-full p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-apocalypse-terminal/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Instagram size={32} className="text-apocalypse-terminal" />
          </div>
          
          <h3 className="text-xl text-white mb-4">Generation Limit Reached</h3>
          
          <p className="text-white/80 mb-6">
            We are so excited you are enjoying this! Providing the computers to 
            run this application is expensive, so we have a small favor to ask 
            before we increase your limit.
          </p>
          
          <div className="glass p-4 rounded-md mb-6 text-left">
            <p className="text-white/80 mb-2">Please:</p>
            <ul className="text-sm text-white/70 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 mr-2 mt-0.5 border border-apocalypse-terminal/50 flex-shrink-0"></span>
                <span>Follow <span className="text-apocalypse-terminal">@replace_rn</span> on Instagram to stay up on our newest nurse-themed memes and image generators.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 mr-2 mt-0.5 border border-apocalypse-terminal/50 flex-shrink-0"></span>
                <span>Sign Up for a free account using your Meta account.</span>
              </li>
            </ul>
            
            <p className="text-sm text-white/80">
              The link for the @replace_rn page is: <a href="https://www.instagram.com/replace_rn/" target="_blank" rel="noopener noreferrer" className="text-apocalypse-terminal underline">instagram.com/replace_rn</a>
            </p>
          </div>
          
          <button
            onClick={handleInstagramLogin}
            className="block w-full px-4 py-3 bg-gradient-to-r from-[#405DE6] via-[#5B51D8] to-[#833AB4] text-white rounded-md transition-transform hover:scale-105 mb-3 flex items-center justify-center space-x-2"
          >
            <Instagram size={20} />
            <span>Follow on Instagram</span>
          </button>
          
          <button
            onClick={onClose}
            className="text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

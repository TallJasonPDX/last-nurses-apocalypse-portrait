
import { Heart, Instagram, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 pt-12 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="text-white text-lg mb-4">THE LAST NURSES</h3>
            <p className="text-white/60 text-sm mb-4">
              Transform your nursing photos into post-apocalyptic masterpieces. 
              A tool created just for nurses.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/replace_rn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-base mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-white/60 hover:text-apocalypse-terminal transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white/60 hover:text-apocalypse-terminal transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/examples" className="text-white/60 hover:text-apocalypse-terminal transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/60 hover:text-apocalypse-terminal transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-base mb-4">Support Us</h4>
            <p className="text-white/60 text-sm mb-4">
              It is expensive to run the servers that process these image transformations. Your $2 - $5 donation helps us run this project and build more fun nurse experiences.
            </p>
            <a 
              href="https://venmo.com/replace_rn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#3D95CE]/80 hover:bg-[#3D95CE] text-white rounded-md transition-colors"
            >
              <Send size={16} />
              <span>Donate via Venmo</span>
            </a>
          </div>
        </div>
        
        <div className="text-center pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm flex items-center justify-center">
            Made with <Heart size={14} className="mx-1 text-apocalypse-rust" /> by ReplaceRN © {new Date().getFullYear()}
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0 text-sm text-white/40">
            <Link to="/privacy" className="hover:text-apocalypse-terminal transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-apocalypse-terminal transition-colors">
              Terms of Service
            </Link>
            <Link to="/data-requests" className="hover:text-apocalypse-terminal transition-colors">
              Data Requests
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

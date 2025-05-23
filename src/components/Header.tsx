import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { API } from "@/services/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, username, remainingGenerations, totalGenerations, logout } = useUser();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleFacebookLogin = () => {
    API.connectFacebook();
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-apocalypse-darkgray/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center"
          >
            <img 
              src="/images/top-logo-horiz.png" 
              alt="The Last Nurses" 
              className="h-10" 
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm transition-colors hover:text-apocalypse-terminal ${
                location.pathname === "/" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              HOME
            </Link>
            <Link 
              to="/gallery" 
              className={`text-sm transition-colors hover:text-apocalypse-terminal ${
                location.pathname === "/gallery" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              YOUR CREATIONS
            </Link>
            <Link 
              to="/examples" 
              className={`text-sm transition-colors hover:text-apocalypse-terminal ${
                location.pathname === "/examples" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              EXAMPLES
            </Link>
            <Link 
              to="/about" 
              className={`text-sm transition-colors hover:text-apocalypse-terminal ${
                location.pathname === "/about" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              ABOUT
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="text-xs text-white/70">
                  {remainingGenerations} Credits Remaining
                </div>
                <button 
                  onClick={logout}
                  className="text-xs px-3 py-1.5 bg-apocalypse-rust/80 hover:bg-apocalypse-rust text-white rounded-md transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={handleFacebookLogin}
                className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                CONNECT FACEBOOK
              </button>
            )}
          </nav>
          
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-apocalypse-darkgray/95 backdrop-blur-md border-t border-white/10 animate-slide-down">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-6">
            <Link 
              to="/" 
              className={`text-sm transition-colors ${
                location.pathname === "/" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              HOME
            </Link>
            <Link 
              to="/gallery" 
              className={`text-sm transition-colors ${
                location.pathname === "/gallery" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              YOUR CREATIONS
            </Link>
            <Link 
              to="/examples" 
              className={`text-sm transition-colors ${
                location.pathname === "/examples" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              EXAMPLES
            </Link>
            <Link 
              to="/about" 
              className={`text-sm transition-colors ${
                location.pathname === "/about" ? "text-apocalypse-terminal" : "text-white/80"
              }`}
            >
              ABOUT
            </Link>
            
            {isLoggedIn ? (
              <div className="flex flex-col space-y-3">
                <div className="text-xs text-white/70">
                  {remainingGenerations} Credits Remaining
                </div>
                <button 
                  onClick={logout}
                  className="text-xs w-full px-3 py-1.5 bg-apocalypse-rust/80 hover:bg-apocalypse-rust text-white rounded-md transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={handleFacebookLogin}
                className="text-xs w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                CONNECT FACEBOOK
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

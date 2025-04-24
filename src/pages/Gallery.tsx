
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { ImageOff } from "lucide-react";
import { API } from "@/services/api";
import { format, formatDistanceToNow } from "date-fns";

interface GalleryImage {
  id: string;
  user_id: string;
  workflow_id: string;
  status: string;
  input_image_url: string;
  output_image_url: string | null;
  created_at: string;
  completed_at: string | null;
}

export default function Gallery() {
  useEffect(() => {
    document.title = "The Last Nurses - A Replace_RN application - Gallery";
  }, []);

  const { isLoggedIn } = useUser();
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchGallery = async () => {
      if (!isLoggedIn) {
        setGallery([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const images = await API.getUserImages();
        setGallery(images);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGallery();
    
    const handleAuthChange = () => {
      fetchGallery();
    };
    
    window.addEventListener('user-authenticated', handleAuthChange);
    return () => {
      window.removeEventListener('user-authenticated', handleAuthChange);
    };
    
  }, [isLoggedIn]);

  const handleFacebookLogin = () => {
    API.connectFacebook();
  };

  const formatDate = (dateString: string) => {
    try {
      // Parse the UTC date string to a Date object
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      // Use formatDistanceToNow to get a relative time string
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-white mb-4">Your Gallery</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              All your transformed images in one place.
            </p>
          </div>
          
          {isLoggedIn ? (
            isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-t-4 border-apocalypse-terminal border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70">Loading your transformations...</p>
              </div>
            ) : gallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="glass rounded-lg overflow-hidden transition-transform hover:scale-105">
                    <div className="relative">
                      {item.output_image_url ? (
                        <img 
                          src={item.output_image_url} 
                          alt="Transformed image"
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = ""; // Clear the src to prevent further attempts
                            target.parentElement!.innerHTML = `
                              <div class="aspect-square w-full bg-apocalypse-darkgray flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
                                     stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" 
                                     stroke-linejoin="round" class="lucide lucide-image-off">
                                  <line x1="2" y1="2" x2="22" y2="22"></line>
                                  <path d="M10.41 10.41a2 2 0 1 1 3.18 3.18"></path>
                                  <path d="M2.08 19h4.24c.96 0 1.82-.32 2.56-.88l10.4-10.4c.47-.47.72-1.1.72-1.76 0-1.36-1.12-2.48-2.48-2.48-.66 0-1.29.24-1.76.72l-10.4 10.4c-.56.74-.88 1.6-.88 2.56V19"></path>
                                </svg>
                                <span class="text-white/50 ml-2">Image Loading Failed</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="aspect-square w-full bg-apocalypse-darkgray flex items-center justify-center">
                          <ImageOff className="text-white/30" size={48} />
                          <span className="text-white/50 ml-2">Image Unavailable</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60 text-sm">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageOff className="mx-auto mb-4 text-white/40" size={48} />
                <h3 className="text-white text-xl mb-2">No Images Yet</h3>
                <p className="text-white/60 mb-4">
                  You haven't created any transformations yet.
                </p>
                <a 
                  href="/#upload" 
                  className="px-4 py-2 bg-apocalypse-green/80 hover:bg-apocalypse-green text-black rounded-md transition-colors inline-block"
                >
                  Create Your First Transformation
                </a>
              </div>
            )
          ) : (
            <div className="text-center py-12 glass rounded-lg">
              <h3 className="text-white text-xl mb-4">Sign In Required</h3>
              <p className="text-white/70 mb-6">
                Please sign in with Facebook to view your personal gallery.
              </p>
              <button 
                onClick={handleFacebookLogin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" fill="currentColor" className="inline mr-2" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24h-1.918c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.733 0 1.325-.593 1.325-1.326V1.326C24 .592 23.408 0 22.675 0"/></svg>
                Connect Facebook
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

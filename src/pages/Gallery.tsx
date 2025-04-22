import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { ImageOff } from "lucide-react";
import { API } from "@/services/api";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryImage {
  id: string;
  original: string;
  processed: string;
  date: Date;
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
        
        const galleryImages = images.map(img => ({
          id: img.id || img._id,
          original: img.original_image || img.originalImage,
          processed: img.processed_image || img.processedImage,
          date: new Date(img.created_at || img.createdAt || Date.now())
        }));
        
        setGallery(galleryImages);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGallery();
  }, [isLoggedIn]);

  const handleFacebookLogin = () => {
    API.connectFacebook();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
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
                      <img 
                        src={item.processed} 
                        alt="Transformed image" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60 text-sm">
                          {formatDate(item.date)}
                        </span>
                        <button className="text-xs px-2 py-1 bg-apocalypse-darkgray/80 hover:bg-apocalypse-darkgray text-white/80 hover:text-white rounded transition-colors">
                          View
                        </button>
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

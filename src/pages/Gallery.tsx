
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { ImageOff } from "lucide-react";

// Mock gallery data
const mockGallery = [
  {
    id: "img1",
    original: "https://placehold.co/600x400/333/ffffff?text=Original+1",
    processed: "https://placehold.co/600x400/44734e/ffffff?text=Processed+1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    id: "img2",
    original: "https://placehold.co/600x400/333/ffffff?text=Original+2",
    processed: "https://placehold.co/600x400/44734e/ffffff?text=Processed+2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
  },
  {
    id: "img3",
    original: "https://placehold.co/600x400/333/ffffff?text=Original+3",
    processed: "https://placehold.co/600x400/44734e/ffffff?text=Processed+3",
    date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  }
];

export default function Gallery() {
  const { isLoggedIn } = useUser();
  const [gallery, setGallery] = useState<typeof mockGallery>([]);
  
  useEffect(() => {
    // In a real app, we'd fetch the gallery from the API
    // For now, use mock data if logged in
    if (isLoggedIn) {
      setGallery(mockGallery);
    } else {
      setGallery([]);
    }
  }, [isLoggedIn]);

  // Format date
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
            gallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="glass rounded-lg overflow-hidden transition-transform hover:scale-105">
                    <div className="relative aspect-video">
                      <img 
                        src={item.processed} 
                        alt="Transformed image" 
                        className="w-full h-full object-cover"
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
                Please sign in with Instagram to view your personal gallery.
              </p>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-[#405DE6] via-[#5B51D8] to-[#833AB4] text-white rounded-md transition-transform hover:scale-105"
              >
                Connect Instagram
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

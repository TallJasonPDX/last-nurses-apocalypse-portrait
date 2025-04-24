import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { ImageOff, EyeOff } from "lucide-react";
import { API } from "@/services/api";
import { formatDistanceToNow, parseISO } from "date-fns";
import ResultDisplay from "@/components/ResultDisplay";
import { useHiddenImages } from "@/hooks/useHiddenImages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
  const { hideImage, isImageHidden, unhideAllImages } = useHiddenImages();
  const [imageToHide, setImageToHide] = useState<string | null>(null);

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
    API.connectFacebook().then(() => {
      window.location.reload();
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  const filteredGallery = gallery.filter(item => !isImageHidden(item.id));

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
            ) : filteredGallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => (
                  <div key={item.id} className="glass rounded-lg overflow-hidden relative group">
                    {item.output_image_url && item.input_image_url ? (
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
                          onClick={() => setImageToHide(item.id)}
                        >
                          <EyeOff className="h-4 w-4 text-white" />
                        </Button>
                        <ResultDisplay
                          originalImage={item.input_image_url}
                          processedImage={item.output_image_url}
                          onReset={() => {}}
                          hideReset
                          imageUrl={item.output_image_url}
                        />
                        <div className="p-4 border-t border-white/10">
                          <span className="text-white/60 text-sm">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square w-full bg-apocalypse-darkgray flex items-center justify-center">
                        <ImageOff className="text-white/30" size={48} />
                        <span className="text-white/50 ml-2">Image Unavailable</span>
                      </div>
                    )}
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
            <div className="text-center py-12 glass rounded-lg flex flex-col items-center">
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
          {isLoggedIn && filteredGallery.length !== gallery.length && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  unhideAllImages();
                  setGallery([...gallery]); // Force re-render
                }}
                className="text-white hover:text-white hover:bg-white/10"
              >
                Unhide all Hidden Images
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AlertDialog open={!!imageToHide} onOpenChange={() => setImageToHide(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide Image</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to permanently hide this image from your Gallery?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (imageToHide) {
                  hideImage(imageToHide);
                  setImageToHide(null);
                }
              }}
            >
              Hide Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

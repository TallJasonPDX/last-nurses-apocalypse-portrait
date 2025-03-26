
import { useState, useRef } from "react";
import { Upload, Image, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import ProcessingAnimation from "./ProcessingAnimation";
import ResultDisplay from "./ResultDisplay";
import LimitReachedModal from "./LimitReachedModal";
import { API, encodeImageToBase64 } from "@/services/api";

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const { remainingGenerations, decrementGenerations } = useUser();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
        setProcessedImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Clear selected image
  const handleClearImage = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Clear any polling
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  };

  // Process the image
  const handleProcessImage = async () => {
    if (!selectedImage) return;
    
    // Check if user has remaining generations
    if (remainingGenerations <= 0) {
      setShowLimitModal(true);
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Convert the data URL to base64
      const base64Data = selectedImage.split(",")[1];
      
      // Send to API
      const response = await API.processImage(base64Data);
      setJobId(response.job_id);
      
      // Start polling for job status
      pollInterval.current = setInterval(async () => {
        try {
          if (!response.job_id) return;
          
          const statusResponse = await API.getJobStatus(response.job_id);
          
          if (statusResponse.status === "COMPLETED" && statusResponse.output_image) {
            // Job is complete
            setProcessedImage(statusResponse.output_image);
            setIsProcessing(false);
            decrementGenerations();
            
            // Clear interval
            if (pollInterval.current) {
              clearInterval(pollInterval.current);
              pollInterval.current = null;
            }
            
            toast.success("Your image has been transformed!");
          } else if (statusResponse.status === "FAILED") {
            // Job failed
            setIsProcessing(false);
            toast.error(statusResponse.error || "Failed to process image");
            
            // Clear interval
            if (pollInterval.current) {
              clearInterval(pollInterval.current);
              pollInterval.current = null;
            }
          }
          // If still processing, continue polling
        } catch (error) {
          console.error("Error polling job status:", error);
          setIsProcessing(false);
          toast.error("Failed to check processing status");
          
          // Clear interval
          if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
          }
        }
      }, 10000); // Poll every 10 seconds
      
    } catch (error) {
      console.error("Error processing image:", error);
      setIsProcessing(false);
      toast.error("Failed to process image. Please try again.");
    }
  };

  // Clean up on unmount
  useState(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  });

  return (
    <section id="upload" className="py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-white mb-3">Transform Your Image</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Upload an image of yourself, a group photo (up to 3 people), or hospital scene 
            to transform it into a post-apocalyptic masterpiece.
          </p>
        </div>
        
        <div className="glass rounded-lg p-6 mb-6">
          {!selectedImage ? (
            // Upload interface
            <div 
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-apocalypse-terminal/50"
              onClick={handleUploadClick}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
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
          ) : processedImage ? (
            // Result display
            <ResultDisplay 
              originalImage={selectedImage}
              processedImage={processedImage}
              onReset={handleClearImage}
            />
          ) : isProcessing ? (
            // Processing animation
            <ProcessingAnimation />
          ) : (
            // Image preview before processing
            <div className="text-center">
              <div className="relative w-full max-w-md mx-auto mb-4">
                <img 
                  src={selectedImage} 
                  alt="Selected Image" 
                  className="w-full h-auto rounded-lg border border-white/20"
                />
                <button 
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-apocalypse-darkgray/80 hover:bg-apocalypse-darkgray p-1 rounded-full text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleUploadClick}
                  className="px-4 py-2 bg-apocalypse-gray/80 hover:bg-apocalypse-gray text-white rounded-md transition-colors inline-flex items-center space-x-2"
                >
                  <Camera size={16} />
                  <span>Choose Different Image</span>
                </button>
                
                <button 
                  onClick={handleProcessImage}
                  className="px-6 py-2 bg-apocalypse-green/80 hover:bg-apocalypse-green text-black rounded-md transition-colors font-medium"
                >
                  Transform Image
                </button>
              </div>
              
              <p className="mt-3 text-sm text-white/60">
                You have {remainingGenerations} image transformations remaining
              </p>
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-white/50">
          <p>
            By uploading an image, you agree to our Terms of Service and Privacy Policy. 
            Images must be appropriate and cannot contain nudity or offensive content.
          </p>
        </div>
      </div>
      
      {/* Limit Reached Modal */}
      {showLimitModal && (
        <LimitReachedModal onClose={() => setShowLimitModal(false)} />
      )}
    </section>
  );
}

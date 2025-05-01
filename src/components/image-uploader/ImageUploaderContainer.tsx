import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import UploadInterface from "./UploadInterface";
import ImagePreview from "./ImagePreview";
import ProcessingAnimation from "../ProcessingAnimation";
import ResultDisplay from "../ResultDisplay";
import LimitReachedModal from "../LimitReachedModal";
import { API, encodeImageToBase64 } from "@/services/api";
import { decrementAnonymousQuota } from "@/hooks/useAnonymousId";
import { fixImageOrientation } from "@/lib/utils";

export default function ImageUploaderContainer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const { remainingGenerations, decrementGenerations, isLoggedIn } = useUser();

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    try {
      // Show loading state or indicator
      const tempReader = new FileReader();
      tempReader.onload = () => {
        // Set a temporary preview immediately while orientation fixing happens
        if (typeof tempReader.result === "string") {
          setSelectedImage(tempReader.result);
        }
      };
      tempReader.readAsDataURL(file);
      
      // Apply EXIF orientation correction
      const correctedImageDataUrl = await fixImageOrientation(file);
      
      // Update with the corrected image when ready
      setSelectedImage(correctedImageDataUrl);
      setProcessedImage(null);
    } catch (error) {
      console.error("Error fixing image orientation:", error);
      
      // Fall back to standard FileReader if orientation fixing fails
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
          setProcessedImage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear selected image
  const handleClearImage = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setImageUrl(null);
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
      
      // Decrement the generation count based on user type
      decrementGenerations();
      
      // Start polling for job status
      pollInterval.current = setInterval(async () => {
        try {
          if (!response.job_id) return;
          
          const statusResponse = await API.getJobStatus(response.job_id);
          console.log("Status response:", statusResponse);
          
          // Check for both 'COMPLETED' and 'completed' status values
          if ((statusResponse.status === "COMPLETED" || statusResponse.status === "completed") && statusResponse.output_image) {
            // Job is complete
            setProcessedImage(statusResponse.output_image);
            if (statusResponse.image_url) {
              setImageUrl(statusResponse.image_url);
            }
            setIsProcessing(false);
            
            // Clear interval
            if (pollInterval.current) {
              clearInterval(pollInterval.current);
              pollInterval.current = null;
            }
            
            toast.success("Your image has been transformed!");
          } else if (statusResponse.status === "FAILED" || statusResponse.status === "failed") {
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
      }, 5000); // Poll every 5 seconds
      
    } catch (error) {
      console.error("Error processing image:", error);
      setIsProcessing(false);
      toast.error("Failed to process image. Please try again.");
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-white mb-3">Transform Your Image</h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Upload an image of yourself, a group photo (up to 3 people), or your hospital (inside or out) 
          to transform it into a post-apocalyptic masterpiece.  Tips: Use clear photos and avoid small faces (including in the background).  Allow room around each person so we can transform the environment as well.
        </p>
      </div>
      
      <div className="glass rounded-lg p-6 mb-6">
        {!selectedImage ? (
          <UploadInterface onFileSelect={handleFileChange} />
        ) : processedImage ? (
          <ResultDisplay 
            originalImage={selectedImage}
            processedImage={processedImage}
            imageUrl={imageUrl || undefined}
            onReset={handleClearImage}
          />
        ) : isProcessing ? (
          <ProcessingAnimation />
        ) : (
          <ImagePreview 
            imageUrl={selectedImage}
            remainingGenerations={remainingGenerations}
            onClearImage={handleClearImage}
            onChooseDifferent={() => fileInputRef.current?.click()}
            onProcessImage={handleProcessImage}
          />
        )}
      </div>
      
      <div className="text-center text-sm text-white/50">
        <p>
          By uploading an image, you agree to our Terms of Service and Privacy Policy. 
        </p>
      </div>
      
      {/* Limit Reached Modal */}
      {showLimitModal && (
        <LimitReachedModal onClose={() => setShowLimitModal(false)} />
      )}
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
}

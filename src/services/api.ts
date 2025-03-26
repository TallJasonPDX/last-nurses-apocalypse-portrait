
import { toast } from "sonner";

interface ProcessImageRequest {
  workflow_name: string;
  image: string; // base64 encoded
  endpointId: string;
  waitForResponse?: boolean;
}

interface JobStatusResponse {
  job_id: string;
  status: string;
  output_image?: string;
  error?: string;
  message?: string;
}

// Mock API for now, will be replaced with actual API
const API_BASE_URL = "https://sdbe.replit.app"; 
const ENDPOINT_ID = "ep-post-apocalyptic-nurse-01"; // Placeholder endpoint ID

export const API = {
  processImage: async (image: string): Promise<JobStatusResponse> => {
    try {
      // For now we'll mock the API call
      const data: ProcessImageRequest = {
        workflow_name: "lastnurses_api", // As specified in requirements
        image: image,
        endpointId: ENDPOINT_ID,
        waitForResponse: false
      };
      
      // In a real implementation, this would be:
      // const response = await fetch(`${API_BASE_URL}/api/images/process-image`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const result = await response.json();
      
      // Mock response for demonstration
      console.log("Processing image...", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mocked job ID
      return {
        job_id: "mock-job-" + Date.now(),
        status: "PROCESSING",
        message: "Image processing started"
      };
    } catch (error) {
      toast.error("Failed to process image. Please try again.");
      throw error;
    }
  },
  
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    try {
      // In real implementation, this would be:
      // const response = await fetch(`${API_BASE_URL}/api/images/job-status/${jobId}?endpointId=${ENDPOINT_ID}`);
      // const result = await response.json();
      
      console.log("Checking job status for", jobId);
      
      // For demo purposes, randomly determine if job is done
      const isComplete = Math.random() > 0.7;
      
      if (isComplete) {
        // Return mock success response
        return {
          job_id: jobId,
          status: "COMPLETED",
          output_image: "https://placehold.co/800x800/44734e/ffffff?text=Processed+Image",
          message: "Image processing completed"
        };
      }
      
      // Return still processing
      return {
        job_id: jobId,
        status: "PROCESSING",
        message: "Image still processing"
      };
    } catch (error) {
      toast.error("Failed to check job status. Please try again.");
      throw error;
    }
  }
};

// Function to encode file as base64
export const encodeImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert image to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

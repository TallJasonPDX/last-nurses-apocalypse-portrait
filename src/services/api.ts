import { toast } from "sonner";

interface ProcessImageRequest {
  workflow_name: string;
  image: string; // base64 encoded
  waitForResponse?: boolean;
}

interface JobStatusResponse {
  job_id: string;
  status: string; // Can be "COMPLETED", "completed", "FAILED", "failed", etc.
  output_image?: string;
  error?: string;
  message?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  username?: string;
  message?: string;
  error?: string;
  credits?: number;
}

// API base URL for backend
const API_BASE_URL = "https://sdbe.replit.app"; 
const ENDPOINT_ID = "ep-post-apocalyptic-nurse-01"; // Production endpoint ID

export const API = {
  // Instagram authentication
  connectInstagram: async (): Promise<void> => {
    try {
      // Open Instagram OAuth page in a popup window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        `${API_BASE_URL}/auth/instagram`,
        'instagram-auth',
        `width=${width},height=${height},top=${top},left=${left}`
      );
      
      // Listen for messages from the popup
      const authPromise = new Promise<AuthResponse>((resolve, reject) => {
        window.addEventListener('message', (event) => {
          // Verify origin to ensure it's from our backend
          if (event.origin === API_BASE_URL) {
            const data = event.data;
            
            if (data.success) {
              resolve(data);
            } else {
              reject(new Error(data.error || 'Authentication failed'));
            }
            
            // Close the popup
            if (popup) popup.close();
          }
        }, { once: true });
        
        // Handle popup being closed manually
        const checkClosed = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Authentication window was closed'));
          }
        }, 500);
      });
      
      // Wait for authentication to complete
      const authData = await authPromise;
      
      // Store auth info in localStorage
      if (authData.token) {
        localStorage.setItem("auth_token", authData.token);
      }
      if (authData.username) {
        localStorage.setItem("username", authData.username);
      }
      if (authData.credits) {
        localStorage.setItem("remaining_generations", authData.credits.toString());
      }
      
      // Set Instagram connected flag
      localStorage.setItem("instagram_connected", "true");
      
      // Show success message
      toast.success(`Connected as ${authData.username || 'user'}`);
      
      // Reload the page to update the UI state
      window.location.reload();
      
    } catch (error) {
      console.error('Instagram authentication error:', error);
      toast.error("Failed to connect with Instagram. Please try again.");
    }
  },
  
  processImage: async (image: string): Promise<JobStatusResponse> => {
    try {
      const data: ProcessImageRequest = {
        workflow_name: "lastnurses_api", // Using the correct workflow name
        image: `data:image/jpeg;base64,${image}`, // Prepend the required prefix
        waitForResponse: false
      };
      
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add auth token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Make the actual API call to the backend
      const response = await fetch(`${API_BASE_URL}/api/images/process-image`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process image");
      }
      
      const result = await response.json();
      console.log("Image processing started:", result);
      
      return result;
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process image. Please try again.");
      throw error;
    }
  },
  
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add auth token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/images/job-status/${jobId}`, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to check job status");
      }
      
      const result = await response.json();
      console.log("Job status:", result);
      
      return result;
    } catch (error) {
      console.error("Error checking job status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to check job status. Please try again.");
      throw error;
    }
  },
  
  // Add getUserImages endpoint to fetch user's generated images for the gallery
  getUserImages: async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        // Return empty array if not authenticated
        return [];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/images/user-images`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch images");
      }
      
      const result = await response.json();
      console.log("User images fetched:", result);
      
      return result.images || [];
    } catch (error) {
      console.error("Error fetching user images:", error);
      toast.error("Failed to load your gallery. Please try again later.");
      return [];
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

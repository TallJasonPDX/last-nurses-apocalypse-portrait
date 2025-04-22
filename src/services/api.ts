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
  image_url?: string; // Add the direct image URL property
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
  // Instagram authentication based on the API docs
  connectInstagram: async (): Promise<void> => {
    try {
      // Get the authorization URL from the backend first
      const authUrlResponse = await fetch(`${API_BASE_URL}/api/auth/instagram/authorize`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!authUrlResponse.ok) {
        throw new Error('Failed to get Instagram authorization URL');
      }
      
      const responseData = await authUrlResponse.json();
      const instagramAuthUrl = responseData.authorization_url || responseData.auth_url || responseData.url;
      
      if (!instagramAuthUrl) {
        throw new Error('No authorization URL returned from server');
      }
      
      // Open Instagram OAuth page in a popup window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        instagramAuthUrl,
        'instagram-auth',
        `width=${width},height=${height},top=${top},left=${left}`
      );
      
      // Listen for the redirect back with auth code
      const authPromise = new Promise<AuthResponse>((resolve, reject) => {
        // Function to handle the redirect with code parameter
        const handleRedirect = async (redirectUrl: string) => {
          try {
            // Extract the auth code from the URL
            const url = new URL(redirectUrl);
            const code = url.searchParams.get('code');
            
            if (!code) {
              reject(new Error('No authorization code provided'));
              return;
            }
            
            // Call the login endpoint with the auth code
            const loginResponse = await fetch(`${API_BASE_URL}/api/auth/instagram-login?code=${code}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (!loginResponse.ok) {
              const errorData = await loginResponse.json();
              throw new Error(errorData.detail || 'Authentication failed');
            }
            
            const userData = await loginResponse.json();
            resolve({
              success: true,
              token: userData.access_token,
              username: userData.username || userData.user?.username,
              credits: userData.credits || userData.remaining_generations || 10
            });
          } catch (error) {
            reject(error);
          }
        };
        
        // Check if window location changes in the popup
        if (popup) {
          const checkPopup = setInterval(() => {
            try {
              // When the popup redirects to our domain
              if (popup.location.hostname === window.location.hostname) {
                clearInterval(checkPopup);
                handleRedirect(popup.location.href);
                popup.close();
              }
            } catch (e) {
              // Cross-origin error, ignore
            }
          }, 500);
          
          // Handle popup being closed manually
          const checkClosed = setInterval(() => {
            if (popup && popup.closed) {
              clearInterval(checkClosed);
              clearInterval(checkPopup);
              reject(new Error('Authentication window was closed'));
            }
          }, 500);
        }
      });
      
      // Wait for authentication to complete
      const authResult = await authPromise;
      
      // Store auth info in localStorage
      if (authResult.token) {
        localStorage.setItem("auth_token", authResult.token);
      }
      if (authResult.username) {
        localStorage.setItem("username", authResult.username);
      }
      if (authResult.credits) {
        localStorage.setItem("remaining_generations", authResult.credits.toString());
      }
      
      // Set Instagram connected flag
      localStorage.setItem("instagram_connected", "true");
      
      // Show success message
      toast.success(`Connected as ${authResult.username || 'user'}`);
      
      // Reload the page to update the UI state
      window.location.reload();
      
    } catch (error) {
      console.error('Instagram authentication error:', error);
      toast.error("Failed to connect with Instagram. Please try again.");
    }
  },
  
  connectFacebook: async (): Promise<void> => {
    try {
      // Get Facebook authorization URL from backend
      const authUrlResponse = await fetch(`${API_BASE_URL}/api/auth/facebook/authorize`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!authUrlResponse.ok) {
        throw new Error('Failed to get Facebook authorization URL');
      }

      // The backend should return a JSON with the auth url (authorization_url, auth_url, or url)
      const responseData = await authUrlResponse.json();
      const facebookAuthUrl =
        responseData.authorization_url ||
        responseData.auth_url ||
        responseData.url;

      if (!facebookAuthUrl) {
        throw new Error('No authorization URL returned from server');
      }

      // Open Facebook OAuth page in a popup window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      const popup = window.open(
        facebookAuthUrl,
        'facebook-auth',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      // Listen for the redirect back with code parameter
      const authPromise = new Promise((resolve, reject) => {
        const handleRedirect = async (redirectUrl: string) => {
          try {
            const url = new URL(redirectUrl);
            const code = url.searchParams.get('code');

            if (!code) {
              reject(new Error('No authorization code provided'));
              return;
            }

            // Call backend to exchange code for a token
            const loginResponse = await fetch(
              `${API_BASE_URL}/api/auth/facebook-login?code=${code}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            if (!loginResponse.ok) {
              const errorData = await loginResponse.json();
              throw new Error(errorData.detail || 'Authentication failed');
            }

            const userData = await loginResponse.json();
            resolve(userData);
          } catch (error) {
            reject(error);
          }
        };

        if (popup) {
          const checkPopup = setInterval(() => {
            try {
              // Only proceed if redirected back to the same domain
              if (popup.location.hostname === window.location.hostname) {
                clearInterval(checkPopup);
                handleRedirect(popup.location.href);
                popup.close();
              }
            } catch (_) {
              // Cross-origin, ignore until it returns to our domain
            }
          }, 500);

          // Detect if popup closed before completion
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed);
              clearInterval(checkPopup);
              reject(new Error('Authentication window was closed'));
            }
          }, 500);
        }
      });

      // Wait for backend authentication
      const authResult: any = await authPromise;

      // Store auth info in localStorage
      if (authResult.access_token) {
        localStorage.setItem("auth_token", authResult.access_token);
      }
      if (authResult.username) {
        localStorage.setItem("username", authResult.username);
      }
      if (authResult.credits) {
        localStorage.setItem("remaining_generations", authResult.credits.toString());
      }

      localStorage.setItem("facebook_connected", "true");

      // Show success message
      toast.success(`Connected as ${authResult.username || 'user'} (Facebook)`);
      // Reload the page to update state/UI
      window.location.reload();

    } catch (error) {
      console.error('Facebook authentication error:', error);
      toast.error("Failed to connect with Facebook. Please try again.");
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

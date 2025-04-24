import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { getAnonymousId, clearAnonymousData } from "@/hooks/useAnonymousId";
import { isMobile } from 'react-device-detect';

interface ProcessImageRequest {
  workflow_name: string;
  image: string; // base64 encoded
  waitForResponse?: boolean;
  anonymous_user_id?: string;
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
            
            // Get anonymous ID if it exists
            const anonymousId = getAnonymousId();
            
            // Call the login endpoint with the auth code and anonymous ID
            const loginResponse = await fetch(`${API_BASE_URL}/api/auth/instagram-login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                code: code,
                anonymous_user_id: anonymousId
              })
            });
            
            if (!loginResponse.ok) {
              const errorData = await loginResponse.json();
              throw new Error(errorData.detail || 'Authentication failed');
            }
            
            const userData = await loginResponse.json();
            
            // Clear anonymous data after successful login
            clearAnonymousData();
            
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
      
      // After successful login, reload the page to update the UI state
      window.location.reload();
      
    } catch (error) {
      console.error('Instagram authentication error:', error);
    }
  },
  
  completeFacebookLogin: async (code: string, anonymousId: string | null): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/facebook-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, anonymous_user_id: anonymousId }),
      });

      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.detail || `Facebook login completion failed (${response.status})`);
      }

      return {
        success: true,
        token: userData.access_token,
        username: userData.username,
        credits: userData.credits
      };

    } catch (error) {
      console.error("Error completing Facebook login:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
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
        const errorData = await authUrlResponse.json();
        console.error('Facebook auth URL error:', errorData);
        throw new Error('Failed to get Facebook authorization URL');
      }

      const responseData = await authUrlResponse.json();
      const facebookAuthUrl =
        responseData.authorization_url ||
        responseData.auth_url ||
        responseData.url;

      if (!facebookAuthUrl) {
        throw new Error('No authorization URL returned from server');
      }

      const anonymousId = getAnonymousId();
      
      if (isMobile) {
        console.log("[Facebook Connect] Mobile detected, using full-page redirect.");
        if (anonymousId) {
          sessionStorage.setItem('anonymous_user_id_pending', anonymousId);
        } else {
          sessionStorage.removeItem('anonymous_user_id_pending');
        }
        window.location.href = facebookAuthUrl;
      } else {
        console.log("[Facebook Connect] Desktop detected, using popup.");
        const width = 600;
        const height = 700;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;
        
        const popup = window.open(
          facebookAuthUrl,
          'facebook-auth',
          `width=${width},height=${height},top=${top},left=${left}`
        );

        const authPromise = new Promise<AuthResponse>((resolve, reject) => {
          let loginProcessed = false;
          
          const handleRedirect = async (redirectUrl: string) => {
            if (loginProcessed) return;
            loginProcessed = true;
            
            try {
              console.log("[Popup handleRedirect] URL:", redirectUrl);
              const url = new URL(redirectUrl);
              const code = url.searchParams.get('code');
              
              if (!code) {
                const error = url.searchParams.get('error');
                reject(new Error(error || 'No authorization code provided in popup redirect'));
                return;
              }
              
              const authResult = await API.completeFacebookLogin(code, anonymousId);
              
              if (authResult.success && authResult.token) {
                localStorage.setItem("auth_token", authResult.token);
                if (authResult.username) localStorage.setItem("username", authResult.username);
                localStorage.setItem("remaining_generations", (authResult.credits ?? 5).toString());
                localStorage.setItem("facebook_connected", "true");
                
                clearAnonymousData();
                
                const eventPayload = {
                  token: authResult.token,
                  username: authResult.username || `user${Math.floor(Math.random() * 1000)}`,
                  credits: authResult.credits ?? 5
                };
                
                window.dispatchEvent(new CustomEvent('user-authenticated', { detail: eventPayload }));
                resolve(authResult);
              } else {
                throw new Error(authResult.error || 'Failed to complete Facebook login');
              }
            } catch (error) {
              console.error("[Popup handleRedirect] Error:", error);
              reject(error);
            } finally {
              if (popup && !popup.closed) popup.close();
            }
          };

          if (popup) {
            const checkPopup = setInterval(() => {
              if (loginProcessed || popup.closed) {
                clearInterval(checkPopup);
                return;
              }
              
              try {
                if (popup.location.href.includes('/facebook-auth-callback')) {
                  if (popup.location.search.includes('code=')) {
                    console.log("[Popup Check] Detected callback URL with code.");
                    clearInterval(checkPopup);
                    handleRedirect(popup.location.href);
                  } else if (popup.location.search.includes('error=')) {
                    console.log("[Popup Check] Detected callback URL with error.");
                    clearInterval(checkPopup);
                    handleRedirect(popup.location.href);
                  }
                }
              } catch (_) {
                // Cross-origin error, ignore until redirect happens
              }
            }, 300);
            
            const checkClosed = setInterval(() => {
              if (popup.closed) {
                clearInterval(checkClosed);
                if (!loginProcessed) {
                  clearInterval(checkPopup);
                  reject(new Error('Authentication window was closed'));
                }
              }
            }, 500);
          } else {
            reject(new Error("Failed to open popup window."));
          }
        });
        
        try {
          await authPromise;
          console.log("[Facebook Connect] Desktop popup flow completed.");
        } catch (error) {
          if (error instanceof Error && error.message === 'Authentication window was closed') {
            console.log("Authentication popup closed by user.");
          } else {
            console.error('[Facebook Connect] Desktop popup flow error:', error);
            toast.error(error instanceof Error ? error.message : "Facebook connection failed.");
          }
        }
      }
    } catch (error) {
      console.error('Facebook authentication error:', error);
      toast.error(error instanceof Error ? error.message : "Could not connect to Facebook.");
    }
  },
  
  processImage: async (image: string): Promise<JobStatusResponse> => {
    try {
      const data: ProcessImageRequest = {
        workflow_name: "lastnurses_api",
        image: `data:image/jpeg;base64,${image}`,
        waitForResponse: false
      };
      
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        const anonymousId = getAnonymousId();
        data.anonymous_user_id = anonymousId;
      }
      
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
      throw error;
    }
  },
  
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
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
      throw error;
    }
  },
  
  getUserImages: async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        return [];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/user/history`, {
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
      
      return result || [];
    } catch (error) {
      console.error("Error fetching user images:", error);
      return [];
    }
  }
};

export const encodeImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert image to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

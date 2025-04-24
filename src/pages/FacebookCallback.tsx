
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '@/services/api';
import { toast } from 'sonner';

const FacebookCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        const errorDescription = searchParams.get('error_description') || errorParam;
        setError(`Facebook login failed: ${errorDescription}`);
        toast.error(`Facebook login error: ${errorDescription}`);
        navigate('/'); // Navigate home on error
        return;
      }

      if (code) {
        // Retrieve the anonymous ID stored before redirect
        const anonymousId = sessionStorage.getItem('anonymous_user_id_pending');
        sessionStorage.removeItem('anonymous_user_id_pending'); // Clean up

        try {
          // Call the backend to complete the login using the code
          const authResult = await API.completeFacebookLogin(code, anonymousId);

          if (authResult.success && authResult.token) {
            // Store token and user info
            localStorage.setItem("auth_token", authResult.token);
            if (authResult.username) localStorage.setItem("username", authResult.username);
            localStorage.setItem("remaining_generations", (authResult.credits ?? 5).toString());
            localStorage.setItem("facebook_connected", "true");
            
            // Clear anonymous ID from localStorage now that it's associated
            localStorage.removeItem('anonymous_user_id');
            localStorage.removeItem('anonymous_generations_remaining');

            // Dispatch event for UserContext to update UI
            window.dispatchEvent(new CustomEvent('user-authenticated', { 
              detail: {
                token: authResult.token,
                username: authResult.username,
                credits: authResult.credits
              }
            }));
            
            toast.success(`Logged in as ${authResult.username || 'user'}`);
            navigate('/'); // Navigate to home page after successful login
          } else {
            throw new Error(authResult.error || 'Failed to complete Facebook login.');
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'An unknown error occurred during login.';
          setError(message);
          toast.error(message);
          navigate('/'); // Navigate home on error
        }
      } else {
        setError('No authorization code found in callback.');
        toast.error('Facebook authentication callback was invalid.');
        navigate('/'); // Navigate home if code is missing
      }
    };

    processCallback();
  }, [location, navigate]);

  // Render loading indicator
  return (
    <div className="min-h-screen flex items-center justify-center bg-apocalypse-darkgray">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-apocalypse-terminal border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/80">Completing Facebook Login...</p>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default FacebookCallback;

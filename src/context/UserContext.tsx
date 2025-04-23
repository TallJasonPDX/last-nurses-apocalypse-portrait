
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserContextType = {
  isLoggedIn: boolean;
  remainingGenerations: number;
  totalGenerations: number;
  username: string | null;
  instagramConnected: boolean;
  login: (token: string) => void;
  logout: () => void;
  decrementGenerations: () => void;
  increaseGenerationsForFollow: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState(1); // Default is now 1
  const [totalGenerations, setTotalGenerations] = useState(1); // Default is now 1
  const [username, setUsername] = useState<string | null>(null);
  const [instagramConnected, setInstagramConnected] = useState(false);

  // Function to refresh user state from localStorage
  const refreshUserState = () => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUsername = localStorage.getItem("username");
    const storedGenerations = localStorage.getItem("remaining_generations");
    const storedInstagramConnected = localStorage.getItem("instagram_connected");
    const storedFacebookConnected = localStorage.getItem("facebook_connected");
    
    if (storedToken) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setInstagramConnected(storedInstagramConnected === "true");
      
      if (storedGenerations) {
        const generations = parseInt(storedGenerations, 10);
        setRemainingGenerations(generations);
        
        if (storedInstagramConnected === "true" || storedFacebookConnected === "true") {
          setTotalGenerations(10);
        } else {
          setTotalGenerations(3);
        }
      }
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      setRemainingGenerations(1);
      setTotalGenerations(1);
      setInstagramConnected(false);
    }
  };

  useEffect(() => {
    // Initial user state setup
    refreshUserState();
    
    // Set up event listener for authentication events
    const handleAuthentication = () => {
      console.log("Authentication event detected, refreshing user state");
      refreshUserState();
    };
    
    window.addEventListener('user-authenticated', handleAuthentication);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('user-authenticated', handleAuthentication);
    };
  }, []);

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("username", "user" + Math.floor(Math.random() * 1000));
    localStorage.setItem("remaining_generations", "5");
    
    setIsLoggedIn(true);
    setUsername(localStorage.getItem("username"));
    setRemainingGenerations(5);
    setTotalGenerations(5);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("remaining_generations");
    localStorage.removeItem("instagram_connected");
    localStorage.removeItem("facebook_connected");
    
    setIsLoggedIn(false);
    setUsername(null);
    setRemainingGenerations(3);
    setTotalGenerations(3);
    setInstagramConnected(false);
  };

  const decrementGenerations = () => {
    const newValue = remainingGenerations - 1;
    setRemainingGenerations(newValue);
    localStorage.setItem("remaining_generations", newValue.toString());
  };

  const increaseGenerationsForFollow = () => {
    const newValue = 11; // 1 initial + 10 for following
    setRemainingGenerations(newValue);
    setTotalGenerations(newValue);
    localStorage.setItem("remaining_generations", newValue.toString());
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        remainingGenerations,
        totalGenerations,
        username,
        instagramConnected,
        login,
        logout,
        decrementGenerations,
        increaseGenerationsForFollow,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


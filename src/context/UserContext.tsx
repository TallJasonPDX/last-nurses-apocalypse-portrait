import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAnonymousQuota } from "@/hooks/useAnonymousId";

interface UserAuthEventDetail {
  token: string;
  username: string;
  credits: number;
}

type UserContextType = {
  isLoggedIn: boolean;
  remainingGenerations: number;
  totalGenerations: number;
  username: string | null;
  instagramConnected: boolean;
  hasUsedInstagramBonus: boolean;
  login: (token: string) => void;
  logout: () => void;
  decrementGenerations: () => void;
  increaseGenerationsForFollow: () => void;
  increaseGenerationsForDonation: () => void;
  setHasUsedInstagramBonus: (value: boolean) => void;
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
  const [remainingGenerations, setRemainingGenerations] = useState(1);
  const [totalGenerations, setTotalGenerations] = useState(1);
  const [username, setUsername] = useState<string | null>(null);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [hasUsedInstagramBonus, setHasUsedInstagramBonus] = useState(false);

  const refreshUserState = () => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUsername = localStorage.getItem("username");
    const storedGenerations = localStorage.getItem("remaining_generations");
    const storedInstagramBonus = localStorage.getItem("has_used_instagram_bonus");
    
    if (storedToken) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      
      if (storedGenerations) {
        const generations = parseInt(storedGenerations, 10);
        setRemainingGenerations(generations);
        
        if (storedInstagramBonus === "true") {
          setHasUsedInstagramBonus(true);
        } else {
          setHasUsedInstagramBonus(false);
        }
      }
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      
      const anonymousQuota = getAnonymousQuota();
      setRemainingGenerations(anonymousQuota);
      setTotalGenerations(1);
      setInstagramConnected(false);
      setHasUsedInstagramBonus(false);
    }
  };

  useEffect(() => {
    refreshUserState();
    
    const handleAuthentication = (event: CustomEvent<UserAuthEventDetail>) => {
      console.log("UserContext: 'user-authenticated' event received", event.detail);
      refreshUserState();
    };
    
    window.addEventListener('user-authenticated', handleAuthentication as EventListener);
    
    return () => {
      window.removeEventListener('user-authenticated', handleAuthentication as EventListener);
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
    
    localStorage.setItem("anonymous_generations_remaining", "1");
    setRemainingGenerations(1);
    setTotalGenerations(1);
    setInstagramConnected(false);
  };

  const decrementGenerations = () => {
    if (isLoggedIn) {
      const newValue = remainingGenerations - 1;
      setRemainingGenerations(newValue);
      localStorage.setItem("remaining_generations", newValue.toString());
    } else {
      const newValue = Math.max(0, getAnonymousQuota() - 1);
      localStorage.setItem("anonymous_generations_remaining", newValue.toString());
      setRemainingGenerations(newValue);
    }
  };

  const increaseGenerationsForFollow = () => {
    const newValue = 11; // 1 initial + 10 for following
    setRemainingGenerations(newValue);
    setTotalGenerations(newValue);
    localStorage.setItem("remaining_generations", newValue.toString());
    localStorage.setItem("has_used_instagram_bonus", "true");
    setHasUsedInstagramBonus(true);
  };

  const increaseGenerationsForDonation = () => {
    const currentGenerations = remainingGenerations;
    const newValue = currentGenerations + 20;
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
        hasUsedInstagramBonus,
        login,
        logout,
        decrementGenerations,
        increaseGenerationsForFollow,
        increaseGenerationsForDonation,
        setHasUsedInstagramBonus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


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
  const [remainingGenerations, setRemainingGenerations] = useState(3); // Free tier limit
  const [totalGenerations, setTotalGenerations] = useState(3);
  const [username, setUsername] = useState<string | null>(null);
  const [instagramConnected, setInstagramConnected] = useState(false);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUsername = localStorage.getItem("username");
    const storedGenerations = localStorage.getItem("remaining_generations");
    const storedInstagramConnected = localStorage.getItem("instagram_connected");
    
    if (storedToken) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setInstagramConnected(storedInstagramConnected === "true");
      
      if (storedGenerations) {
        const generations = parseInt(storedGenerations, 10);
        setRemainingGenerations(generations);
        
        // If Instagram connected, give more free generations
        if (storedInstagramConnected === "true") {
          setTotalGenerations(10);
        }
      }
    }
  }, []);

  const login = (token: string) => {
    // For this version, we'll simulate a login
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

  const connectInstagram = () => {
    localStorage.setItem("instagram_connected", "true");
    localStorage.setItem("remaining_generations", "10");
    
    setInstagramConnected(true);
    setRemainingGenerations(10);
    setTotalGenerations(10);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


import { useEffect, useState } from "react";

const loadingMessages = [
  "Scouting for zombies...",
  "Distressing nurse uniforms...",
  "Spawning cordyceps infection...",
  "Darkening hospital corridors...",
  "Scavenging for medical supplies...",
  "Applying post-apocalyptic filter...",
  "Protecting the last of humanity...",
  "Adding survival gear...",
  "Making humanity's last stand...",
];

export default function ProcessingAnimation() {
  const [message, setMessage] = useState(loadingMessages[0]);
  
  useEffect(() => {
    // Rotate through loading messages
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingMessages.length;
      setMessage(loadingMessages[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 mb-8">
        {/* Spore-like animated loading indicator */}
        <div className="absolute inset-0 rounded-full border-4 border-apocalypse-spore/20 animate-pulse-glow"></div>
        
        <div className="absolute inset-4 rounded-full border-t-4 border-apocalypse-terminal animate-rotate-slow"></div>
        
        <div className="absolute inset-8 rounded-full border-2 border-dashed border-apocalypse-spore/40 animate-rotate-slow" style={{ animationDirection: 'reverse' }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-apocalypse-terminal rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl text-white mb-2">Processing Image</h3>
        <p className="text-apocalypse-terminal terminal-text mb-4">{message}</p>
        <p className="text-white/60 text-sm max-w-md">
          Transforming your image into a post-apocalyptic scene. 
          This typically takes about 30-60 seconds.
        </p>
      </div>
    </div>
  );
}

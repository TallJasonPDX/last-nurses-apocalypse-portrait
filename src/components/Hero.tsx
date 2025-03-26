
import { useState, useEffect, useRef } from "react";

const messages = [
  "The Last Nurses to conquer a pandemic without PPE",
  "The Last Nurses to protect patients in an understaffed unit",
  "The Last Nurses to defend themselves against zombie (patient) attacks",
  "The Last Nurses to provide healthcare in a world turning against science",
  "The Last Nurses to treat patients of a disease eradicated decades ago",
  "The Last Nurses to defend the population against misinformation and conspiracies"
];

export default function Hero() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = useRef(60); // milliseconds per character
  const deletingSpeed = useRef(30); // milliseconds per character
  const delayAfterTyping = useRef(2000); // pause after typing completes
  const delayAfterDeleting = useRef(500); // pause after deleting completes

  useEffect(() => {
    if (isTyping) {
      if (displayText.length < messages[currentMessageIndex].length) {
        // Still typing the current message
        const timeout = setTimeout(() => {
          setDisplayText(messages[currentMessageIndex].substring(0, displayText.length + 1));
        }, typingSpeed.current);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause before deleting
        setIsTyping(false);
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delayAfterTyping.current);
        return () => clearTimeout(timeout);
      }
    } else if (isDeleting) {
      if (displayText.length > 0) {
        // Still deleting the current message
        const timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, deletingSpeed.current);
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next message
        setIsDeleting(false);
        const nextIndex = (currentMessageIndex + 1) % messages.length;
        
        const timeout = setTimeout(() => {
          setCurrentMessageIndex(nextIndex);
          setIsTyping(true);
        }, delayAfterDeleting.current);
        return () => clearTimeout(timeout);
      }
    }
  }, [displayText, isTyping, isDeleting, currentMessageIndex]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-apocalypse-green/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-apocalypse-rust/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="mb-6 text-white">
          <span className="block font-bold opacity-90">THE</span>
          <span className="block text-apocalypse-terminal distressed-text">LAST</span>
          <span className="block font-bold opacity-90">NURSES</span>
        </h1>
        
        <div className="h-20 sm:h-16 flex items-center justify-center mb-8">
          <div className="inline-block terminal-text typing-cursor">
            &gt; {displayText}
          </div>
        </div>
        
        <p className="text-white/70 mb-8 max-w-2xl mx-auto">
          Transform your nursing photos into post-apocalyptic masterpieces. 
          Upload your image and watch as our AI reimagines you in a world 
          where nurses are humanity's last line of defense.
        </p>
        
        <a 
          href="#upload"
          className="inline-block px-6 py-3 rounded-md bg-apocalypse-green text-black font-medium transition-transform hover:scale-105 active:scale-100"
        >
          Transform Your Image
        </a>
      </div>
      
      {/* Scrolling Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}

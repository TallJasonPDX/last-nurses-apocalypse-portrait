
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
  const [showCursor, setShowCursor] = useState(true);
  const typingSpeed = useRef(60); // milliseconds per character
  const deletingSpeed = useRef(30); // milliseconds per character
  const delayAfterTyping = useRef(2000); // pause after typing completes
  const delayAfterDeleting = useRef(1000); // pause after deleting completes

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
        
        // Briefly hide the cursor during the pause
        setShowCursor(false);
        
        const timeout = setTimeout(() => {
          setCurrentMessageIndex(nextIndex);
          setShowCursor(true);
          setIsTyping(true);
        }, delayAfterDeleting.current);
        return () => clearTimeout(timeout);
      }
    }
  }, [displayText, isTyping, isDeleting, currentMessageIndex]);

  return (
    <section className="relative min-h-[65vh] flex flex-col items-center justify-center overflow-hidden px-4 py-8 sm:py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-apocalypse-green/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-apocalypse-rust/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <img 
          src="/logo-square.png" 
          alt="The Last Nurses" 
          className="h-32 sm:h-40 md:h-48 mx-auto mb-4" 
        />
        
        <div className="h-16 sm:h-14 flex items-center justify-center mb-6">
          <div className={`inline-block terminal-text ${showCursor ? "typing-cursor" : ""}`}>
            &gt; {displayText}
          </div>
        </div>
      </div>
    </section>
  );
}

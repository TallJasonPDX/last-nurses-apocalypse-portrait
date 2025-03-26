import { useState, useEffect } from "react";

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
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  const typingSpeed = 60; // milliseconds per character
  const messageDisplayTime = 2000; // how long to show completed message
  const cursorBlinkTime = 1000; // cursor blink time before new message

  useEffect(() => {
    let timeout;

    if (isTyping) {
      if (displayText.length < messages[currentMessageIndex].length) {
        // Still typing the current message
        timeout = setTimeout(() => {
          setDisplayText(messages[currentMessageIndex].substring(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, pause before showing new line
        timeout = setTimeout(() => {
          // Clear current typing display
          setDisplayText("");
          setIsTyping(false);
          // Show blinking cursor on empty line
          setShowCursor(true);
        }, messageDisplayTime);
      }
    } else {
      // Show blinking cursor for a moment, then start typing next message
      timeout = setTimeout(() => {
        // Move to next message
        const nextIndex = (currentMessageIndex + 1) % messages.length;
        setCurrentMessageIndex(nextIndex);
        setIsTyping(true);
      }, cursorBlinkTime);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentMessageIndex]);

  return (
    <section className="relative min-h-[50vh] sm:min-h-[45vh] flex flex-col items-center justify-center overflow-hidden px-4 py-1 sm:py-2">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-apocalypse-green/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-apocalypse-rust/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <img 
          src="/lovable-uploads/59977c5a-cfc6-45ed-b037-b1fff5e1f247.png" 
          alt="The Last Nurses" 
          className="w-[94%] sm:w-[400px] mx-auto mb-2" 
        />
        
        <div className="font-mono text-left text-apocalypse-green mb-4 max-w-2xl mx-auto h-12 sm:h-14">
          {/* Terminal line with typing effect */}
          <div className={`terminal-line ${showCursor ? "typing-cursor" : ""}`}>
            &gt; {displayText}
          </div>
        </div>
      </div>
    </section>
  );
}
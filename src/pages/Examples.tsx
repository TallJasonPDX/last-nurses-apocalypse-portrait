
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock examples data
const examples = [
  {
    id: "ex1",
    original: "https://thelastnurses.com/images/meredith2.jpg",
    processed: "https://thelastnurses.com/images/day2-1.png",
    title: "Grey's Anatomy"
  },
  {
    id: "ex2",
    original: "https://thelastnurses.com/images/res1.jpg",
    processed: "https://thelastnurses.com/images/day1-2.png",
    title: "The Resident"
  },
  {
    id: "ex3",
    original: "https://thelastnurses.com/images/gd2.jpg",
    processed: "https://thelastnurses.com/images/day4-1.png",
    title: "The Good Doctor"
  },
  {
    id: "ex4",
    original: "https://thelastnurses.com/images/std5.jpg",
    processed: "https://thelastnurses.com/images/day3-1.png",
    title: "St. Denis"
  },
];

// New landscape group example
const groupExample = {
  id: "group1",
  original: "https://thelastnurses.com/images/group-original.jpg",
  processed: "https://thelastnurses.com/images/group-processed.jpg",
  title: "Medical Team"
};

export default function Examples() {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Set the document title with the Examples page suffix
    document.title = "The Last Nurses - A Replace_RN application - Examples";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-white mb-4">Example Transformations</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              See what's possible with The Last Nurses transformation tool.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {examples.map((example) => (
              <div key={example.id} className="glass rounded-lg overflow-hidden p-4">
                <h3 className="text-white text-xl mb-4 text-center">{example.title}</h3>
                
                <div className={`${isMobile ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-2 gap-4'}`}>
                  <div className="space-y-2">
                    <div className="w-full rounded-md overflow-hidden">
                      <img 
                        src={example.original} 
                        alt={`Original ${example.title}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <p className="text-center text-white/70 text-sm">Before</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full rounded-md overflow-hidden">
                      <img 
                        src={example.processed} 
                        alt={`Transformed ${example.title}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <p className="text-center text-white/70 text-sm">After</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Group example - full width landscape layout */}
          <div className="mb-16">
            <div className="glass rounded-lg overflow-hidden p-4">
              <h3 className="text-white text-xl mb-4 text-center">{groupExample.title}</h3>
              
              <div className={`${isMobile ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-2 gap-8'}`}>
                <div className="space-y-2">
                  <div className="w-full rounded-md overflow-hidden">
                    <img 
                      src={groupExample.original} 
                      alt={`Original ${groupExample.title}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <p className="text-center text-white/70 text-sm">Before</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full rounded-md overflow-hidden">
                    <img 
                      src={groupExample.processed} 
                      alt={`Transformed ${groupExample.title}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <p className="text-center text-white/70 text-sm">After</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="/#upload" 
              className="px-6 py-3 bg-apocalypse-green/80 hover:bg-apocalypse-green text-black rounded-md transition-colors inline-block font-medium"
            >
              Transform Your Own Image
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

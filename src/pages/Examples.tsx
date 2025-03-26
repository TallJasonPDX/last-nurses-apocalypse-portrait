
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock examples data
const examples = [
  {
    id: "ex1",
    original: "https://placehold.co/600x800/333/ffffff?text=Before+1",
    processed: "https://placehold.co/600x800/44734e/ffffff?text=After+1",
    title: "Lone Survivor Nurse"
  },
  {
    id: "ex2",
    original: "https://placehold.co/600x800/333/ffffff?text=Before+2",
    processed: "https://placehold.co/600x800/44734e/ffffff?text=After+2",
    title: "Team of Healers"
  },
  {
    id: "ex3",
    original: "https://placehold.co/600x800/333/ffffff?text=Before+3",
    processed: "https://placehold.co/600x800/44734e/ffffff?text=After+3",
    title: "Hospital Scene"
  },
  {
    id: "ex4",
    original: "https://placehold.co/600x800/333/ffffff?text=Before+4",
    processed: "https://placehold.co/600x800/44734e/ffffff?text=After+4",
    title: "Nurse on Duty"
  },
];

export default function Examples() {
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="aspect-[3/4] overflow-hidden rounded-md">
                      <img 
                        src={example.original} 
                        alt={`Original ${example.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-center text-white/70 text-sm">Before</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="aspect-[3/4] overflow-hidden rounded-md">
                      <img 
                        src={example.processed} 
                        alt={`Transformed ${example.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-center text-white/70 text-sm">After</p>
                  </div>
                </div>
              </div>
            ))}
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

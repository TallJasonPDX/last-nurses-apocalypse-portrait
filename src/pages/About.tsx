
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Instagram, Send } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-white mb-4">About The Last Nurses</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              The story behind our post-apocalyptic nurse transformation tool.
            </p>
          </div>
          
          <div className="glass rounded-lg p-6 md:p-8 mb-12">
            <h2 className="text-white text-2xl mb-6">Our Mission</h2>
            
            <p className="text-white/80 mb-4">
              Replace RN is a fun company that helps nurses express themselves by putting them 
              into memes and scenes that depict the reality of nursing. The Last Nurses is our 
              first tool, but many more are still to come.
            </p>
            
            <p className="text-white/80 mb-4">
              We are run by a few individuals and not backed by any large company or investors. 
              If you like what we are doing and are using it, please consider sending a Venmo 
              donation of $2 - $5 to help us pay for our high end graphic server costs.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 my-8">
              <a 
                href="https://www.instagram.com/replace_rn/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#405DE6] via-[#5B51D8] to-[#833AB4] text-white rounded-md transition-transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Instagram size={20} />
                <span>Follow on Instagram</span>
              </a>
              
              <a 
                href="https://venmo.com/replace_rn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-[#3D95CE]/80 hover:bg-[#3D95CE] text-white rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>Donate via Venmo</span>
              </a>
            </div>
            
            <p className="text-white/80">
              Follow Us to be the first to know about additional themes, memes and the best in 
              nurse humor.
            </p>
          </div>
          
          <div className="glass rounded-lg p-6 md:p-8 mb-12">
            <h2 className="text-white text-2xl mb-6">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-apocalypse-green/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-apocalypse-terminal text-2xl font-bold">1</span>
                </div>
                <h3 className="text-white text-lg mb-2">Upload</h3>
                <p className="text-white/70 text-sm">
                  Upload your selfie, group photo, or hospital scene.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 rounded-full bg-apocalypse-green/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-apocalypse-terminal text-2xl font-bold">2</span>
                </div>
                <h3 className="text-white text-lg mb-2">Transform</h3>
                <p className="text-white/70 text-sm">
                  Our AI processes your image with post-apocalyptic elements.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 rounded-full bg-apocalypse-green/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-apocalypse-terminal text-2xl font-bold">3</span>
                </div>
                <h3 className="text-white text-lg mb-2">Share</h3>
                <p className="text-white/70 text-sm">
                  Download and share your transformation on social media.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="/#upload" 
              className="px-6 py-3 bg-apocalypse-green/80 hover:bg-apocalypse-green text-black rounded-md transition-colors inline-block font-medium"
            >
              Try It Now
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

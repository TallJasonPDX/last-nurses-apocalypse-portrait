
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="glass rounded-lg p-6 md:p-8 text-center max-w-md">
          <AlertTriangle className="mx-auto mb-4 text-apocalypse-terminal" size={48} />
          <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
          <p className="text-xl text-white/80 mb-6">
            Looks like this page didn't survive the apocalypse
          </p>
          <a 
            href="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-apocalypse-green/80 hover:bg-apocalypse-green text-black rounded-md transition-colors font-medium"
          >
            <Home size={18} />
            <span>Return to Safety</span>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

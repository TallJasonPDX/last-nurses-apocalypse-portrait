
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImageUploader from "@/components/ImageUploader";
import Footer from "@/components/Footer";

export default function Index() {
  useEffect(() => {
    // Set the document title for the Index/Home page without suffix
    document.title = "The Last Nurses - A Replace_RN application";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Hero />
        <ImageUploader />
      </main>
      <Footer />
    </div>
  );
}

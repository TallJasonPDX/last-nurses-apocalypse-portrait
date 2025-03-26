
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-display mb-8 text-white">Terms of Service</h1>
            <div className="text-white/80 space-y-6">
              <p>This is where your HTML terms of service content will go.</p>
              <p>The content in this div will adapt to standard site fonts and styles.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

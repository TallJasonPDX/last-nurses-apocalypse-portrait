
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function DataRequests() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-display mb-8 text-white">Data Requests</h1>
            {/* HTML content will be pasted below */}
            <div className="text-white/80 space-y-6">
              <p>This is where your HTML data requests content will go.</p>
              <p>The content in this div will adapt to standard site fonts and styles.</p>
            </div>
            {/* End of HTML content area */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

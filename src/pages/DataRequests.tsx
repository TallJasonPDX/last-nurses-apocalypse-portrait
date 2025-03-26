
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function DataRequests() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-display mb-8 text-white">Data Requests</h1>
            <div className="text-white/80 space-y-6">
              <h1>Request Data Deletion</h1>
  <p>If you would like to request deletion of your personal data from our systems, please email us at:</p>
  <p><a href="mailto:dataquestions@replacern.com">dataquestions@replacern.com</a></p>
  <p>Include the following details in your email:</p>
  <ul>
    <li>Your full name</li>
    <li>The email address you used within the app</li>
    <li>A description of the data or image(s) you wish to delete</li>
  </ul>
  <p>We will confirm receipt of your request and process it within 30 days.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

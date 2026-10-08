import Navbar from '../sections/Navbar';
import Hero from '../sections/Hero';
import Showcase from '../sections/Showcase';
import UseCases from '../sections/UseCases';
import Facilities from '../sections/Facilities';
import Pricing from '../sections/Pricing';
import FAQ from '../sections/FAQ';
import Footer from '../sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-warm-ivory font-sans text-deep-charcoal selection:bg-terracotta selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <UseCases />
        <Facilities />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;

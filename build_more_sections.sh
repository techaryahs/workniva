cat << 'APP_W_EOF' > src/App.tsx
import React from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import QuickBooking from './sections/QuickBooking';
import Showcase from './sections/Showcase';
import UseCases from './sections/UseCases';
import Availability24x7 from './sections/Availability24x7';
import Facilities from './sections/Facilities';
import Audience from './sections/Audience';
import Pricing from './sections/Pricing';
import HowItWorks from './sections/HowItWorks';
import Comparison from './sections/Comparison';
import Gallery from './sections/Gallery';
import Testimonials from './sections/Testimonials';
import Location from './sections/Location';
import FAQ from './sections/FAQ';
import FinalCTA from './sections/FinalCTA';
import Footer from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <QuickBooking />
        <Showcase />
        <UseCases />
        <Availability24x7 />
        <Facilities />
        <Audience />
        <Pricing />
        <HowItWorks />
        <Comparison />
        <Gallery />
        <Testimonials />
        <Location />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
APP_W_EOF

cat << 'QB_EOF' > src/sections/QuickBooking.tsx
import React from 'react';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Users } from 'lucide-react';

const QuickBooking = () => (
  <section className="relative z-30 -mt-12 md:-mt-16 px-4 md:px-6">
    <div className="container mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-4 items-end max-w-5xl mx-auto border border-slate-100">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="date" className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
            </select>
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 mb-2">Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option>1-2 People</option>
              <option>3-4 People</option>
            </select>
          </div>
        </div>
        <Button size="lg" className="w-full md:w-auto mt-4 md:mt-0">
          Check Availability
        </Button>
      </div>
    </div>
  </section>
);
export default QuickBooking;
QB_EOF

cat << 'AV24_EOF' > src/sections/Availability24x7.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Sun, Moon, Clock } from 'lucide-react';

const Availability24x7 = () => (
  <section className="py-24 bg-slate-900 text-white">
    <div className="container mx-auto px-4 md:px-6 text-center">
      <SectionHeading title="Morning. Evening. Midnight. We're Open." subtitle="Secure smart lock access means your office is ready whenever inspiration strikes." />
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 mt-12">
        <div className="flex flex-col items-center">
          <Sun className="w-12 h-12 text-blue-400 mb-4" />
          <h4 className="text-xl font-bold">Early Birds</h4>
          <p className="text-slate-400 mt-2">Start at 6 AM.</p>
        </div>
        <div className="hidden md:block h-px w-24 bg-slate-700"></div>
        <div className="flex flex-col items-center">
          <Clock className="w-12 h-12 text-blue-400 mb-4" />
          <h4 className="text-xl font-bold">Standard</h4>
          <p className="text-slate-400 mt-2">Core hours.</p>
        </div>
        <div className="hidden md:block h-px w-24 bg-slate-700"></div>
        <div className="flex flex-col items-center">
          <Moon className="w-12 h-12 text-blue-400 mb-4" />
          <h4 className="text-xl font-bold">Night Owls</h4>
          <p className="text-slate-400 mt-2">Work until late.</p>
        </div>
      </div>
    </div>
  </section>
);
export default Availability24x7;
AV24_EOF

cat << 'AUD_EOF' > src/sections/Audience.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';

const Audience = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="Built For Your Business Moments" subtitle="Tailored environments for every professional need." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Startups', 'Freelancers', 'Remote Teams'].map((aud, i) => (
          <div key={i} className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-bold mb-3">{aud}</h3>
            <p className="text-slate-600">Perfectly suited for {aud.toLowerCase()} looking for a premium workspace without the overhead.</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Audience;
AUD_EOF

cat << 'HW_EOF' > src/sections/HowItWorks.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';

const HowItWorks = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="How It Works" subtitle="Four simple steps to your new office." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {['Select Date & Time', 'Choose Your Room', 'Complete Payment', 'Get Access Code'].map((step, i) => (
          <div key={i} className="text-center relative z-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              {i + 1}
            </div>
            <h4 className="text-lg font-semibold">{step}</h4>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default HowItWorks;
HW_EOF

cat << 'COMP_EOF' > src/sections/Comparison.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Check, X } from 'lucide-react';

const Comparison = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <SectionHeading title="Traditional vs RentOffice" subtitle="Why tie yourself down when you can have flexibility?" />
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 p-6 font-semibold">
          <div>Feature</div>
          <div className="text-center text-slate-500">Traditional Lease</div>
          <div className="text-center text-blue-600">RentOffice</div>
        </div>
        {[
          ['Commitment', 'Years', 'Hours/Days'],
          ['Setup Time', 'Months', 'Instant'],
          ['Utilities', 'Extra', 'Included'],
          ['Furniture', 'You Buy', 'Premium Included']
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-3 p-6 border-b border-slate-100 last:border-0 items-center">
            <div className="font-medium text-slate-700">{row[0]}</div>
            <div className="text-center text-slate-500 flex items-center justify-center gap-2">
              <X className="w-4 h-4 text-red-400" /> {row[1]}
            </div>
            <div className="text-center text-slate-900 font-semibold flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-green-500" /> {row[2]}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Comparison;
COMP_EOF

cat << 'GAL_EOF' > src/sections/Gallery.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';

const Gallery = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="Explore Our Spaces" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
            <img src={\`https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400&h=400&sig=\${i}\`} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Gallery;
GAL_EOF

cat << 'TEST_EOF' > src/sections/Testimonials.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';

const Testimonials = () => (
  <section className="py-24 bg-slate-900 text-white">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="What Our Clients Say" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[1, 2].map(i => (
          <div key={i} className="bg-slate-800 p-8 rounded-xl relative">
            <p className="text-lg italic mb-6">"RentOffice gave us the perfect space to pitch our startup to investors. The environment is premium, quiet, and absolutely professional."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
              <div>
                <h4 className="font-bold">Sarah Jenkins</h4>
                <p className="text-sm text-slate-400">Founder, TechStart</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Testimonials;
TEST_EOF

cat << 'LOC_EOF' > src/sections/Location.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MapPin } from 'lucide-react';

const Location = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="Find Us" subtitle="Located in the heart of the business district." />
      <div className="flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 bg-slate-200 aspect-video rounded-xl flex items-center justify-center">
          <span className="text-slate-500">[Map Placeholder]</span>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Downtown Center</h3>
              <p className="text-slate-600 mb-4">123 Business Avenue, Suite 400<br/>Metropolis, NY 10001</p>
              <p className="text-slate-600"><strong>Hours:</strong> 24/7 for members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default Location;
LOC_EOF

cat << 'FCTA_EOF' > src/sections/FinalCTA.tsx
import React from 'react';
import { Button } from '../components/ui/Button';

const FinalCTA = () => (
  <section className="py-24 bg-blue-600 text-white text-center">
    <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Need a Professional Space?</h2>
      <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Book your premium office today and elevate your work environment in minutes.</p>
      <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-50">
        Book Your Space Now
      </Button>
    </div>
  </section>
);
export default FinalCTA;
FCTA_EOF

chmod +x build_more_sections.sh
./build_more_sections.sh

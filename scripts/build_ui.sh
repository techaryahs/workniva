mkdir -p src/components/ui
mkdir -p src/sections
mkdir -p src/data
mkdir -p src/types

cat << 'TYPES_EOF' > src/types/index.ts
export interface UseCase { title: string; description: string; icon: string; }
export interface Facility { title: string; description: string; icon: string; }
export interface PricingPlan { title: string; price: string; period: string; features: string[]; isPopular?: boolean; }
export interface FaqItem { question: string; answer: string; }
TYPES_EOF

cat << 'DATA_EOF' > src/data/index.ts
import { UseCase, Facility, PricingPlan, FaqItem } from '../types';

export const useCases: UseCase[] = [
  { title: 'Client Meetings', description: 'Impress clients in a premium environment.', icon: 'Users' },
  { title: 'Interviews', description: 'Conduct interviews in a professional setting.', icon: 'Briefcase' },
  { title: 'Brainstorming', description: 'Whiteboards and space to think.', icon: 'Lightbulb' },
  { title: 'Quiet Work', description: 'Escape the noise and focus.', icon: 'Headphones' },
  { title: 'Workshops', description: 'Host small group workshops.', icon: 'Presentation' },
  { title: 'Podcasting', description: 'Quiet rooms with good acoustics.', icon: 'Mic' },
  { title: 'Freelancer Base', description: 'Your office away from home.', icon: 'Laptop' },
  { title: 'Startup Hub', description: 'A base for your growing team.', icon: 'Rocket' },
];

export const facilities: Facility[] = [
  { title: 'High-Speed Wi-Fi', description: 'Enterprise-grade internet connectivity.', icon: 'Wifi' },
  { title: 'Smart TV & AV', description: 'For seamless presentations.', icon: 'Tv' },
  { title: 'Whiteboards', description: 'Capture your big ideas.', icon: 'PenTool' },
  { title: 'Premium Coffee', description: 'Keep the energy high.', icon: 'Coffee' },
  { title: 'Ergonomic Chairs', description: 'Work comfortably for hours.', icon: 'Armchair' },
  { title: 'Printing & Scanning', description: 'Business center amenities.', icon: 'Printer' },
  { title: 'Secure Access', description: '24/7 smart lock entry.', icon: 'Lock' },
  { title: 'Climate Control', description: 'Adjustable AC and heating.', icon: 'Thermometer' },
];

export const pricingPlans: PricingPlan[] = [
  { title: '1 Hour', price: '$25', period: '/hour', features: ['All amenities', 'Up to 4 guests', 'Free cancellation'] },
  { title: 'Half Day', price: '$80', period: '/4 hours', features: ['All amenities', 'Up to 4 guests', 'Priority support'], isPopular: true },
  { title: 'Full Day', price: '$140', period: '/8 hours', features: ['All amenities', 'Up to 4 guests', 'Dedicated assistant'] },
];

export const faqs: FaqItem[] = [
  { question: 'How do I access the office?', answer: 'You will receive a smart lock code 15 minutes before your booking starts.' },
  { question: 'Is parking available?', answer: 'Yes, we have dedicated parking spots for guests.' },
  { question: 'Can I cancel my booking?', answer: 'Cancellations made 24 hours in advance are fully refunded.' },
  { question: 'Are there hidden fees?', answer: 'No, the price you see is the price you pay. All amenities are included.' },
  { question: 'Can I bring guests?', answer: 'Yes, our standard offices accommodate up to 4 people.' },
];
DATA_EOF

cat << 'UI_EOF' > src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900',
    outline: 'border-2 border-slate-300 text-slate-700 hover:border-slate-400',
  };
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button className={\`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`} {...props}>
      {children}
    </button>
  );
};
UI_EOF

cat << 'SEC_HD_EOF' > src/components/ui/SectionHeading.tsx
import React from 'react';

interface Props { title: string; subtitle?: string; align?: 'left' | 'center'; }

export const SectionHeading: React.FC<Props> = ({ title, subtitle, align = 'center' }) => (
  <div className={\`mb-12 \${align === 'center' ? 'text-center' : 'text-left'}\`}>
    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);
SEC_HD_EOF

cat << 'APP_EOF' > src/App.tsx
import React from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Showcase from './sections/Showcase';
import UseCases from './sections/UseCases';
import Facilities from './sections/Facilities';
import Pricing from './sections/Pricing';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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
APP_EOF

cat << 'NAV_EOF' > src/sections/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Building2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={\`fixed top-0 w-full z-50 transition-all duration-300 \${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}\`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">RentOffice</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#faq" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">FAQ</a>
        </nav>
        <div className="hidden md:block">
          <Button>Book Your Space</Button>
        </div>
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
        </button>
      </div>
    </header>
  );
};
export default Navbar;
NAV_EOF

cat << 'HERO_EOF' > src/sections/Hero.tsx
import React from 'react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10" />
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Premium Office" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">A Professional Space, Whenever You Need It.</h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl">Premium workspaces available by the hour. Designed for focus, meetings, and growing your business.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg">Check Availability</Button>
            <Button variant="outline" size="lg" className="text-lg text-white border-white hover:bg-white/10 hover:text-white hover:border-white">View Spaces</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
HERO_EOF

cat << 'SHOWCASE_EOF' > src/sections/Showcase.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';

const Showcase = () => (
  <section className="py-24 bg-white" id="features">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="More Than Just a Workspace" subtitle="Experience a meticulously designed environment that elevates your professional image." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden group relative aspect-[4/3]">
          <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80" alt="Meeting Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
            <h3 className="text-2xl font-bold text-white">Executive Meeting Rooms</h3>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden group relative aspect-[4/3]">
          <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80" alt="Quiet Pods" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
            <h3 className="text-2xl font-bold text-white">Focus Pods</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default Showcase;
SHOWCASE_EOF

cat << 'USECASES_EOF' > src/sections/UseCases.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useCases } from '../data';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

const UseCases = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="One Space. Many Possibilities." subtitle="Whether you're presenting to investors or recording a podcast, we have the setup." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {useCases.map((useCase, index) => {
          const IconComponent = (Icons as any)[useCase.icon] || Icons.CheckCircle;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
              <p className="text-slate-600">{useCase.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
export default UseCases;
USECASES_EOF

cat << 'FACILITIES_EOF' > src/sections/Facilities.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { facilities } from '../data';
import * as Icons from 'lucide-react';

const Facilities = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading title="Everything You Need to Work Professionally" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {facilities.map((facility, index) => {
          const IconComponent = (Icons as any)[facility.icon] || Icons.Check;
          return (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <IconComponent className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-lg mb-1">{facility.title}</h4>
              <p className="text-sm text-slate-500">{facility.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
export default Facilities;
FACILITIES_EOF

cat << 'PRICING_EOF' > src/sections/Pricing.tsx
import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { pricingPlans } from '../data';
import { Button } from '../components/ui/Button';
import { Check } from 'lucide-react';

const Pricing = () => (
  <section className="py-24 bg-slate-900 text-white" id="pricing">
    <div className="container mx-auto px-4 md:px-6">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Only What You Need.</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Flexible pricing for flexible work styles. No long-term commitments required.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div key={index} className={\`rounded-2xl p-8 \${plan.isPopular ? 'bg-blue-600 transform md:-translate-y-4' : 'bg-slate-800'}\`}>
            {plan.isPopular && <div className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Most Popular</div>}
            <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className={\`text-sm \${plan.isPopular ? 'text-blue-200' : 'text-slate-400'}\`}>{plan.period}</span>
            </div>
            <ul className="mb-8 space-y-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className={\`w-5 h-5 \${plan.isPopular ? 'text-blue-200' : 'text-blue-500'}\`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant={plan.isPopular ? 'secondary' : 'primary'} className="w-full">
              Choose Plan
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);
export default Pricing;
PRICING_EOF

cat << 'FAQ_EOF' > src/sections/FAQ.tsx
import React, { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { faqs } from '../data';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50" id="faq">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown className={\`w-5 h-5 transition-transform \${openIndex === index ? 'rotate-180' : ''}\`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-slate-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FAQ;
FAQ_EOF

cat << 'FOOTER_EOF' > src/sections/Footer.tsx
import React from 'react';
import { Building2 } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400 py-12">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold tracking-tight text-white">RentOffice</span>
          </div>
          <p className="max-w-md">Premium workspaces designed for modern professionals. Available by the hour, day, or month.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} RentOffice. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
export default Footer;
FOOTER_EOF

chmod +x build_ui.sh
./build_ui.sh

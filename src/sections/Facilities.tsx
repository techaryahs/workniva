import { motion } from 'framer-motion';
import { Wifi, Wind, Coffee, Zap, Shield, Car, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Facilities() {
  const amenities = [
    { icon: <Wifi className="w-6 h-6" />, name: "High-Speed Wi-Fi" },
    { icon: <Wind className="w-6 h-6" />, name: "Air Conditioning" },
    { icon: <Coffee className="w-6 h-6" />, name: "Comfortable Seating" },
    { icon: <Zap className="w-6 h-6" />, name: "Power & Charging" },
    { icon: <Shield className="w-6 h-6" />, name: "Clean & Secure Space" },
    { icon: <Car className="w-6 h-6" />, name: "Parking Available" }
  ];

  const steps = [
    { num: '01', text: 'Choose your date' },
    { num: '02', text: 'Choose your time' },
    { num: '03', text: 'Choose your duration' },
    { num: '04', text: 'Pay securely' },
    { num: '05', text: 'Walk in and work' }
  ];

  return (
    <>
      {/* Amenities */}
      <section id="amenities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-deep-charcoal mb-4">Everything you need to work professionally.</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {amenities.map((item, i) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center p-6 bg-warm-ivory rounded-xl border border-soft-beige text-center hover:border-muted-sage transition-colors"
              >
                <div className="text-terracotta mb-4">{item.icon}</div>
                <h3 className="font-medium text-deep-charcoal">{item.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-deep-forest text-warm-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display mb-4">How it works</h2>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-warm-ivory/20" />
            {steps.map((step, i) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center w-full md:w-40"
              >
                <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center font-display text-xl mb-4 shadow-lg">
                  {step.num}
                </div>
                <p className="font-medium">{step.text}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/booking"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-deep-forest bg-warm-ivory rounded-full hover:bg-terracotta hover:text-white transition-colors duration-300"
            >
              Book Your Space &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-24 bg-warm-ivory border-b border-soft-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-display text-deep-charcoal mb-6"
              >
                Easy to reach.<br />Easy to work from.
              </motion.h2>
              <div className="space-y-6 text-deep-charcoal/80 mb-8">
                <p className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-terracotta mt-0.5 shrink-0" />
                  <span><strong>WorkNiva Prime HQ</strong><br />Sector 15, CBD Belapur, Navi Mumbai, Maharashtra 400614</span>
                </p>
                <p className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-terracotta mt-0.5 shrink-0" />
                  <span>5 minutes walk from CBD Belapur Railway Station.</span>
                </p>
                <p className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-terracotta mt-0.5 shrink-0" />
                  <span>Ample street parking available nearby.</span>
                </p>
              </div>
              <a 
                href="#"
                className="inline-flex items-center text-deep-forest font-semibold hover:text-terracotta transition-colors"
              >
                Get Directions &rarr;
              </a>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg border border-soft-beige">
              <img 
                src="https://images.unsplash.com/photo-1572205336214-729606d0426b?auto=format&fit=crop&q=80&w=800" 
                alt="Map Placeholder" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply bg-soft-beige"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-lg shadow-sm text-sm font-medium text-deep-charcoal">
                  Location Map Loading...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

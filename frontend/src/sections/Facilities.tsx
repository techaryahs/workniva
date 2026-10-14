import { motion } from 'framer-motion';
import { Wifi, Wind, Coffee, Zap, Shield, Check, Phone, Smartphone, PhoneCall, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessContact } from '../data';

export default function Facilities() {
  const amenities = [
    { icon: <Wifi className="w-6 h-6" />, name: "High-Speed Wi-Fi" },
    { icon: <Wind className="w-6 h-6" />, name: "Air Conditioning" },
    { icon: <Coffee className="w-6 h-6" />, name: "Comfortable Seating" },
    { icon: <Zap className="w-6 h-6" />, name: "Power & Charging" },
    { icon: <Shield className="w-6 h-6" />, name: "Clean & Secure Space" }
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
                  <span><strong>{businessContact.name}</strong><br />{businessContact.address.full}</span>
                </p>
                <p className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-terracotta mt-0.5 shrink-0" />
                  <span>{businessContact.transit}</span>
                </p>
              </div>

              {/* Official Contact Numbers */}
              <div className="pt-6 border-t border-soft-beige/80 mb-8">
                <h3 className="text-xs font-bold text-deep-forest uppercase tracking-wider mb-4">Official Contact Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <a
                    href={businessContact.phoneNumbers.mobile.href}
                    aria-label={businessContact.phoneNumbers.mobile.ariaLabel}
                    className="p-3.5 rounded-xl bg-white border border-soft-beige hover:border-deep-forest hover:shadow-xs transition-all flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-soft-beige/70 text-deep-forest flex items-center justify-center shrink-0 group-hover:bg-deep-forest group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-deep-charcoal/60 block font-medium">Call us (Mobile)</span>
                      <span className="font-mono font-semibold text-deep-charcoal group-hover:text-terracotta transition-colors">{businessContact.phoneNumbers.mobile.display}</span>
                    </div>
                  </a>

                  <a
                    href={businessContact.phoneNumbers.additionalMobile.href}
                    aria-label={businessContact.phoneNumbers.additionalMobile.ariaLabel}
                    className="p-3.5 rounded-xl bg-white border border-soft-beige hover:border-deep-forest hover:shadow-xs transition-all flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-soft-beige/70 text-deep-forest flex items-center justify-center shrink-0 group-hover:bg-deep-forest group-hover:text-white transition-colors">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-deep-charcoal/60 block font-medium">Additional contact</span>
                      <span className="font-mono font-semibold text-deep-charcoal group-hover:text-terracotta transition-colors">{businessContact.phoneNumbers.additionalMobile.display}</span>
                    </div>
                  </a>

                  <a
                    href={businessContact.phoneNumbers.landline.href}
                    aria-label={businessContact.phoneNumbers.landline.ariaLabel}
                    className="p-3.5 rounded-xl bg-white border border-soft-beige hover:border-deep-forest hover:shadow-xs transition-all flex items-center gap-3 group sm:col-span-2"
                  >
                    <div className="w-9 h-9 rounded-lg bg-soft-beige/70 text-deep-forest flex items-center justify-center shrink-0 group-hover:bg-deep-forest group-hover:text-white transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-deep-charcoal/60 block font-medium">Landline</span>
                      <span className="font-mono font-semibold text-deep-charcoal group-hover:text-terracotta transition-colors">{businessContact.phoneNumbers.landline.display}</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <a 
                  href={businessContact.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-deep-forest font-semibold hover:text-terracotta transition-colors"
                >
                  Get Directions &rarr;
                </a>
                <a 
                  href={businessContact.emailHref}
                  className="inline-flex items-center gap-1.5 text-sm text-deep-charcoal/70 hover:text-terracotta transition-colors"
                >
                  <Mail className="w-4 h-4 text-terracotta" />
                  <span>{businessContact.email}</span>
                </a>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg border border-soft-beige bg-slate-100">
              <iframe 
                src="https://maps.google.com/maps?q=Aryahs%20World%20Infotech%20OPC%20Pvt%20Ltd,%20Gauri%20Complex,%20Sector%2011,%20CBD%20Belapur&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="WorkNiva Location Map"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

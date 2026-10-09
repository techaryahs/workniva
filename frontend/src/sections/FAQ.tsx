import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import img7 from '../assets/img7.jpeg';

export default function FAQ() {
  const faqs = [
    {
      q: "How does hourly booking work?",
      a: "You select your desired date and time block. You only pay for the specific duration you book, with no memberships required."
    },
    {
      q: "Is the office available 24/7?",
      a: "Yes! You can book the office at any time, including late nights and early mornings. Availability is real-time."
    },
    {
      q: "How many people can use the space?",
      a: "Our private meeting spaces comfortably accommodate 2-6 people, while team workspaces can hold up to 8."
    },
    {
      q: "Is Wi-Fi included?",
      a: "Yes, high-speed Wi-Fi is included complimentary with every booking."
    },
    {
      q: "What happens if I need to cancel?",
      a: "Cancellations must currently be requested manually. Please contact our support team prior to your booking time."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section id="faq" className="py-24 bg-warm-ivory border-t border-soft-beige">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-deep-charcoal mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-soft-beige rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="font-medium text-deep-charcoal">{faq.q}</span>
                  {openIndex === i ? <Minus className="w-5 h-5 text-terracotta" /> : <Plus className="w-5 h-5 text-muted-sage" />}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4 text-deep-charcoal/70 text-sm"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-deep-forest text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: `url(${img7})` }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-display text-warm-ivory mb-6">Need a professional space today?</h2>
          <p className="text-xl text-warm-ivory/80 mb-10">Book the office for exactly the time you need.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link 
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-deep-forest bg-warm-ivory rounded-full hover:bg-terracotta hover:text-white transition-colors duration-300"
              >
                Book Your Space &rarr;
              </Link>
          </div>
        </div>
      </section>
    </>
  );
}

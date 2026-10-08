import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';

export default function Pricing() {
  const [prices, setPrices] = useState<any /* eslint-disable-line */ []>([]);

  useEffect(() => {
    fetchApi('/admin/pricing')
      .then(data => {
        if(Array.isArray(data)) setPrices(data);
      })
      .catch(() => {});
  }, []);

  const getPrice = (duration: string) => {
    const p = prices.find(x => x.duration === duration);
    return p ? `₹${p.price}` : '...';
  };

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-deep-charcoal mb-6"
          >
            Pay for the time you actually need.
          </motion.h2>
          <p className="text-lg text-deep-charcoal/70">Flexible pricing driven directly by availability.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {[
            { label: 'Hourly', duration: '1 Hour' },
            { label: 'Half Day', duration: 'Half Day' },
            { label: 'Full Day', duration: 'Full Day' },
            { label: 'Night', duration: 'Night' }
          ].map((tier, i) => (
            <motion.div 
              key={tier.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-xl bg-warm-ivory border border-soft-beige text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-deep-charcoal mb-2">{tier.label}</h3>
              <p className="text-3xl font-display text-terracotta mb-4">
                {prices.length > 0 ? getPrice(tier.duration) : '₹---'}
              </p>
              <p className="text-sm text-deep-charcoal/60 mb-6">Subject to availability</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
           <Link 
              to="/booking"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-deep-forest rounded-full hover:bg-terracotta transition-colors duration-300"
            >
              Check Availability &rarr;
           </Link>
        </div>
      </div>
    </section>
  );
}

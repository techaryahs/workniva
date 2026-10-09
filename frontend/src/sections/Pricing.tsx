import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { workspaces } from '../components/booking/WorkspaceSelector';

export default function Pricing() {
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
            Pay for the space you actually need.
          </motion.h2>
          <p className="text-lg text-deep-charcoal/70">Flexible workspace pricing driven directly by availability.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {workspaces.map((ws, i) => (
            <motion.div 
              key={ws.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-xl bg-warm-ivory border border-soft-beige text-center hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-medium text-deep-charcoal mb-2">{ws.title}</h3>
                <p className="text-3xl font-display text-terracotta mb-2">
                  ₹{ws.price}
                </p>
                <p className="text-sm font-medium text-deep-charcoal/80 mb-4">
                  {ws.type === 'hourly' ? 'per hour' : 'per person'}
                </p>
              </div>
              <p className="text-sm text-deep-charcoal/60">Capacity: {ws.capacity}</p>
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

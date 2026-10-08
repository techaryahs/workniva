import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function UseCases() {
  const cases = [
    "Client Meeting", "Interview", "Team Meeting", "Presentation",
    "Training", "Remote Work", "Private Work", "Online Meeting"
  ];

  return (
    <>
      {/* Book by the hour section */}
      <section className="py-24 bg-warm-ivory border-y border-soft-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-deep-charcoal mb-6"
          >
            Only need the office for a few hours?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-deep-charcoal/70 mb-12 max-w-2xl mx-auto"
          >
            Book exactly the time you need. No memberships. No long-term commitment.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {['1 Hour', '2 Hours', '4 Hours', 'Half Day', 'Full Day', 'Night'].map((time) => (
              <span key={time} className="px-6 py-3 rounded-full border border-soft-beige bg-white text-deep-charcoal font-medium shadow-sm">
                {time}
              </span>
            ))}
          </motion.div>
          
          <Link 
            to="/booking"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-terracotta rounded-full hover:bg-deep-forest transition-colors duration-300"
          >
            Check Availability &rarr;
          </Link>
        </div>
      </section>

      {/* 24/7 Section */}
      <section className="py-24 bg-deep-forest text-warm-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-display mb-6"
              >
                Your schedule doesn't end at 6.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-warm-ivory/80 mb-8 leading-relaxed"
              >
                Early morning meeting? Late-night project? Interview after office hours? You Work is available when you need it.
              </motion.p>
              <ul className="space-y-4 mb-8 text-warm-ivory/90">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-terracotta" /> 24/7 Availability</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-terracotta" /> Flexible Booking</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-terracotta" /> Professional Environment</li>
              </ul>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800" alt="Office at night" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display text-deep-charcoal mb-4">One space. Many reasons to use it.</h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {cases.map((useCase, i) => (
              <motion.div 
                key={useCase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-soft-beige flex items-center justify-center text-xl font-display text-deep-forest">
                  {i + 1}
                </div>
                <h3 className="text-lg font-medium text-deep-charcoal">{useCase}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More than a room section */}
      <section className="py-24 bg-warm-ivory border-t border-soft-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 relative h-[600px] rounded-xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" alt="Modern professional desk setup" className="absolute inset-0 w-full h-full object-cover" />
             </div>
             <div className="order-1 md:order-2">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-display text-deep-charcoal mb-6 leading-tight"
                >
                  Walk in ready.<br />
                  <span className="text-terracotta">Walk out productive.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-deep-charcoal/70 mb-8 leading-relaxed"
                >
                  We provide more than just a room. We offer a professional impression, a quiet environment, reliable internet, and a meeting-ready setup.
                </motion.p>
                <Link 
                  to="/booking"
                  className="inline-flex items-center text-deep-forest font-semibold hover:text-terracotta transition-colors text-lg"
                >
                  Reserve Now &rarr;
                </Link>
             </div>
          </div>
        </div>
      </section>

    </>
  );
}

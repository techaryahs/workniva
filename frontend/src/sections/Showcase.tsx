import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock } from 'lucide-react';
import img1 from '../assets/img1.jpeg';
import img2 from '../assets/img2.jpeg';
import img8 from '../assets/img8.jpeg';

export default function Showcase() {
  const spaces = [
    {
      name: "Private Cabin",
      capacity: "1–4 persons",
      ideal: "Focused work, Private calls, Small meetings",
      price: "₹400 / hour",
      image: img1
    },
    {
      name: "Conference Room",
      capacity: "1–5 persons",
      ideal: "Client meetings, Interviews, Team discussions",
      price: "₹500 / hour",
      image: img2
    },
    {
      name: "Bench Seating",
      capacity: "1 person",
      ideal: "Freelancers, Remote workers, Quick tasks",
      price: "₹100 / hour",
      image: img8
    }
  ];

  return (
    <section id="spaces" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 max-w-3xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-deep-charcoal mb-6"
          >
            A professional space without the commitment.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-deep-charcoal/70 leading-relaxed"
          >
            Why pay for a full-time office when you only need one for a meeting, an interview, a focused work session, or an important client conversation?
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {spaces.map((space, index) => (
            <motion.div 
              key={space.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative h-[300px] rounded-xl overflow-hidden mb-6 bg-soft-beige">
                <img 
                  src={space.image} 
                  alt={space.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-display text-deep-charcoal mb-3">{space.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-deep-charcoal/70 mb-4">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {space.capacity}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Hourly / Daily</span>
                  </div>
                  <p className="text-sm text-deep-charcoal/60 mb-6">
                    <strong className="font-medium text-deep-charcoal">Ideal for:</strong> {space.ideal}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-deep-charcoal/60 mb-1">Starting at</p>
                  <p className="font-medium text-deep-charcoal">{space.price}</p>
                </div>
              </div>
              <Link to="/booking" className="inline-flex items-center text-terracotta font-medium hover:text-deep-forest transition-colors">
                View Space &rarr;
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

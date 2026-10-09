import { motion } from 'framer-motion';
import img8 from '../assets/img8.jpeg';
import img9 from '../assets/img9.jpeg';
import img10 from '../assets/img10.jpeg';
import img12 from '../assets/img12.jpeg';

export default function Gallery() {


  return (
    <section id="gallery" className="py-24 bg-white border-t border-soft-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-deep-charcoal mb-4"
          >
            Take a look inside.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-deep-charcoal/70"
          >
            Explore the premium finish and professional atmosphere of our workspace.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-sm"
          >
            <img src={img8} alt="Workspace gallery 1" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-sm"
          >
            <img src={img9} alt="Workspace gallery 2" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="h-[300px] rounded-xl overflow-hidden shadow-sm"
          >
            <img src={img10} alt="Workspace gallery 3" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 h-[300px] rounded-xl overflow-hidden shadow-sm"
          >
            <img src={img12} alt="Workspace gallery 4" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

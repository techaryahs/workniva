import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-warm-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-beige/50 text-deep-forest text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              Available 24/7
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display text-deep-charcoal leading-[1.1] mb-6">
              Your space.<br />
              <span className="text-deep-forest">Whenever work calls.</span>
            </h1>
            
            <p className="text-lg text-deep-charcoal/80 mb-10 max-w-lg leading-relaxed">
              Meeting clients, interviewing candidates, working remotely, or bringing your team together — book a professional office by the hour, day, or night.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-deep-forest rounded-full hover:bg-terracotta transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Book a Space &rarr;
              </Link>
              <a 
                href="#spaces"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-deep-charcoal bg-transparent border-2 border-soft-beige rounded-full hover:border-deep-forest transition-colors duration-300"
              >
                Explore the Space
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-deep-charcoal/60 font-medium">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-sage" /> High-Speed Wi-Fi</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-sage" /> Air Conditioning</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted-sage" /> Professional Setup</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              alt="Premium office space"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

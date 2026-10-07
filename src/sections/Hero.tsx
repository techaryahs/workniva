import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden bg-warm-ivory">
      {/* Subtle ambient gradient mesh in background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-deep-forest/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 max-w-2xl"
          >
            {/* Billion-Dollar Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-soft-beige/70 border border-soft-beige text-deep-forest text-xs sm:text-sm font-medium mb-8 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta"></span>
              </span>
              <span className="font-semibold tracking-wide uppercase text-[11px] text-terracotta">WorkNiva Prime</span>
              <span className="text-deep-charcoal/30">|</span>
              <span className="text-deep-charcoal/80">On-Demand Workspaces</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display text-deep-charcoal leading-[1.08] mb-6 tracking-tight">
              Your space.<br />
              <span className="text-deep-forest">Whenever ambition calls.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-deep-charcoal/80 mb-10 max-w-xl leading-relaxed font-normal">
              WorkNiva gives founders, enterprise leaders, and distributed teams immediate access to private boardrooms, meeting suites, and focus spaces by the hour or day. Zero leases, zero friction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                to="/booking"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-deep-forest rounded-full hover:bg-terracotta transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Reserve a Space</span>
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
              <a 
                href="#spaces"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-deep-charcoal bg-white/80 border border-soft-beige rounded-full hover:border-deep-forest hover:bg-white transition-all duration-300 shadow-xs"
              >
                Explore WorkNiva Suites
              </a>
            </div>

            {/* Billion Dollar Trust Metrics */}
            <div className="pt-8 border-t border-soft-beige/80 grid grid-cols-3 gap-6 text-deep-charcoal">
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-deep-forest">24/7</div>
                <div className="text-xs text-deep-charcoal/60 mt-1 uppercase tracking-wider font-medium">Instant Access</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-deep-forest">1 Gbps</div>
                <div className="text-xs text-deep-charcoal/60 mt-1 uppercase tracking-wider font-medium">Fiber Wi-Fi 6</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-terracotta">4.98 ★</div>
                <div className="text-xs text-deep-charcoal/60 mt-1 uppercase tracking-wider font-medium">Member Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image Showcase with Floating Glass Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative h-[480px] sm:h-[560px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/60">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                alt="WorkNiva Executive Suite"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-2 text-xs font-semibold text-deep-charcoal">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>WorkNiva CBD Belapur HQ</span>
                </div>
                <div className="bg-deep-forest/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Ready
                </div>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={logoImg} alt="WorkNiva" className="w-10 h-10 rounded-xl shadow-md object-contain shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-deep-charcoal leading-tight">Executive Boardroom</h4>
                      <p className="text-xs text-deep-charcoal/60">Smart Screen · 4K Video Conference · Ergonomic</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-deep-charcoal/50 block font-medium">Starting</span>
                    <span className="text-base font-bold text-terracotta">₹500<span className="text-xs font-normal text-deep-charcoal/60">/hr</span></span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

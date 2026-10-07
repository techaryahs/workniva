import { Link } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo';
import { ShieldCheck, Award, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-deep-charcoal text-warm-ivory pt-20 pb-12 border-t border-white/10 selection:bg-terracotta selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <BrandLogo 
              size="lg" 
              variant="light" 
              showSubtitle={true} 
              subtitle="Premium Workspace Platform" 
            />
            <p className="text-warm-ivory/70 text-sm leading-relaxed max-w-sm">
              WorkNiva delivers high-performance, on-demand executive workspaces, meeting suites, and team studios engineered for visionary founders and global enterprises.
            </p>

            {/* Trust & Enterprise Badges */}
            <div className="pt-2 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-warm-ivory/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SOC-2 Type II Certified</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-warm-ivory/80">
                <Award className="w-4 h-4 text-[#E27D60]" />
                <span>Enterprise SLA 99.9%</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-warm-ivory/80">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>24/7 Instant Access</span>
              </div>
            </div>
          </div>
          
          {/* Workspaces & Solutions */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase tracking-wider text-xs">Workspaces</h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li><a href="#spaces" className="hover:text-[#E27D60] transition-colors">Private Meeting Rooms</a></li>
              <li><a href="#spaces" className="hover:text-[#E27D60] transition-colors">Executive Boardrooms</a></li>
              <li><a href="#spaces" className="hover:text-[#E27D60] transition-colors">Team Collaboration Hubs</a></li>
              <li><Link to="/booking" className="hover:text-[#E27D60] transition-colors">On-Demand Day Passes</Link></li>
              <li><a href="#pricing" className="hover:text-[#E27D60] transition-colors">Enterprise Multi-Pass</a></li>
            </ul>
          </div>

          {/* Navigation & Platform */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li><a href="#amenities" className="hover:text-[#E27D60] transition-colors">Amenities &amp; Tech</a></li>
              <li><a href="#how-it-works" className="hover:text-[#E27D60] transition-colors">How WorkNiva Works</a></li>
              <li><a href="#pricing" className="hover:text-[#E27D60] transition-colors">Transparent Pricing</a></li>
              <li><a href="#location" className="hover:text-[#E27D60] transition-colors">Flagship Location</a></li>
              <li><a href="#faq" className="hover:text-[#E27D60] transition-colors">Frequently Asked Questions</a></li>
              <li><Link to="/login" className="hover:text-[#E27D60] transition-colors">Member Portal</Link></li>
            </ul>
          </div>
          
          {/* Enterprise Concierge */}
          <div>
            <h4 className="font-semibold text-white mb-5 uppercase tracking-wider text-xs">Concierge &amp; HQ</h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li className="font-mono text-warm-ivory/90 font-medium">+91 98765 43210</li>
              <li><a href="mailto:support@workniva.com" className="hover:text-[#E27D60] transition-colors">support@workniva.com</a></li>
              <li><a href="mailto:enterprise@workniva.com" className="hover:text-[#E27D60] transition-colors">enterprise@workniva.com</a></li>
              <li className="mt-4 pt-4 border-t border-white/10 leading-relaxed text-xs">
                <strong>WorkNiva Prime HQ</strong><br />
                Sector 15, CBD Belapur<br />
                Navi Mumbai, MH 400614
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-warm-ivory/50 gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              WorkNiva Network Active
            </span>
            <p>&copy; {new Date().getFullYear()} WorkNiva Inc. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security &amp; Trust</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

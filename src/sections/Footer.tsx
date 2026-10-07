import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-deep-charcoal text-warm-ivory py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-display text-white mb-4 block">
              You Work
            </Link>
            <p className="text-warm-ivory/70 max-w-sm text-sm">
              Professional Workspace<br/>
              Available when you need it.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-6 uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li><a href="#spaces" className="hover:text-terracotta transition-colors">Spaces</a></li>
              <li><a href="#amenities" className="hover:text-terracotta transition-colors">Amenities</a></li>
              <li><a href="#how-it-works" className="hover:text-terracotta transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-terracotta transition-colors">Pricing</a></li>
              <li><a href="#location" className="hover:text-terracotta transition-colors">Location</a></li>
              <li><a href="#faq" className="hover:text-terracotta transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-6 uppercase tracking-wider text-xs">Contact</h4>
            <ul className="space-y-3 text-sm text-warm-ivory/70">
              <li>+91 98765 43210</li>
              <li>hello@youwork.example.com</li>
              <li className="mt-4 pt-4 border-t border-white/10">
                Sector 15, CBD Belapur<br/>
                Navi Mumbai 400614
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-warm-ivory/50">
          <p>&copy; {new Date().getFullYear()} You Work. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

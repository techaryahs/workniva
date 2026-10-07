import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  // const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };

  const navLinks = [
    { name: 'Spaces', path: '/#spaces' },
    { name: 'Amenities', path: '/#amenities' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Location', path: '/#location' },
    { name: 'FAQ', path: '/#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-warm-ivory/90 backdrop-blur-md border-b border-soft-beige' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showSubtitle={true} subtitle="Navi Mumbai Flagship" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.path} className="text-sm font-medium text-deep-charcoal/80 hover:text-terracotta transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-deep-charcoal/80 hover:text-terracotta transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/my-bookings" className="text-sm font-medium text-deep-charcoal/80 hover:text-terracotta transition-colors">
                  My Bookings
                </Link>
                <button onClick={handleSignOut} className="text-sm font-medium text-deep-charcoal/80 hover:text-terracotta transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-deep-charcoal/80 hover:text-terracotta transition-colors">
                Log in
              </Link>
            )}
            <Link 
              to="/booking" 
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-deep-forest rounded-full hover:bg-terracotta transition-colors"
            >
              Book a Space &rarr;
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-deep-charcoal p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-warm-ivory border-b border-soft-beige shadow-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-4 flex flex-col">
              <div className="pb-3 border-b border-soft-beige">
                <BrandLogo size="sm" />
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="block text-base font-medium text-deep-charcoal hover:text-terracotta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-soft-beige w-full my-4" />
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="block text-base font-medium text-deep-charcoal hover:text-terracotta" onClick={() => setIsMobileMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <Link to="/my-bookings" className="block text-base font-medium text-deep-charcoal hover:text-terracotta" onClick={() => setIsMobileMenuOpen(false)}>
                    My Bookings
                  </Link>
                  <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="block text-base font-medium text-deep-charcoal text-left hover:text-terracotta">
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" className="block text-base font-medium text-deep-charcoal hover:text-terracotta" onClick={() => setIsMobileMenuOpen(false)}>
                  Log in
                </Link>
              )}
              <Link 
                to="/booking" 
                className="mt-4 block text-center px-6 py-3 text-base font-medium text-white bg-deep-forest rounded-full hover:bg-terracotta transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book a Space &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

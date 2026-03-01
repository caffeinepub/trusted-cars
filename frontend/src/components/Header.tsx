import { useState, useEffect } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Phone, Menu, X, Car } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Cars', path: '/cars' },
    { label: 'Book Test Drive', path: '/book' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-header' : 'border-b border-brand-gray-mid'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo area: user logo + Trusted Cars logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            {/* User's custom logo */}
            <img
              src="/assets/trusted_cars_logo-removebg-preview.png"
              alt="Trusted Cars Logo"
              className="h-10 w-auto object-contain"
            />
            {/* Divider */}
            <span className="w-px h-8 bg-brand-gray-mid shrink-0" />
            {/* Trusted Cars wordmark logo */}
            <img
              src="/assets/generated/trusted-cars-logo.dim_200x60.png"
              alt="Trusted Cars"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden items-center gap-1.5" style={{ display: 'none' }}>
              <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-brand-black">
                Trusted<span className="text-brand-red">Cars</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  isActive(link.path)
                    ? 'text-brand-red'
                    : 'text-brand-black hover:text-brand-red'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-200 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Phone + Mobile Menu */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919582149643"
              className="hidden sm:flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded text-sm font-semibold hover:bg-brand-red-dark transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>9582149643</span>
            </a>
            <a
              href="tel:+919582149643"
              className="sm:hidden flex items-center justify-center w-9 h-9 bg-brand-red text-white rounded"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 text-brand-black hover:text-brand-red transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-brand-gray-mid shadow-lg animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path })}
                className={`text-left px-4 py-3 rounded text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-brand-red text-white'
                    : 'text-brand-black hover:bg-brand-gray hover:text-brand-red'
                }`}
              >
                {link.label}
              </button>
            ))}
            <a
              href="tel:+919582149643"
              className="flex items-center gap-2 px-4 py-3 text-brand-red font-semibold text-sm"
            >
              <Phone className="w-4 h-4" />
              Call: 9582149643
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

import { Link } from '@tanstack/react-router';
import { Phone, MapPin, Mail, Car, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'trusted-cars');

  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            {/* Both logos side by side */}
            <div className="flex items-center gap-3">
              {/* User's custom logo (inverted for dark background) */}
              <img
                src="/assets/trusted_cars_logo-removebg-preview.png"
                alt="Trusted Cars Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              {/* Divider */}
              <span className="w-px h-8 bg-white/20 shrink-0" />
              {/* Trusted Cars wordmark logo */}
              <img
                src="/assets/generated/trusted-cars-logo.dim_200x60.png"
                alt="Trusted Cars"
                className="h-10 w-auto object-contain brightness-0 invert"
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
                <span className="font-display font-bold text-xl text-white">
                  Trusted<span className="text-brand-red">Cars</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner for certified pre-owned cars in Karol Bagh, Delhi. Quality vehicles, transparent pricing, easy finance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-base text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Browse Cars', path: '/cars' },
                { label: 'Book Test Drive', path: '/book' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-brand-red transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-base text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-red mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">Karol Bagh, Delhi, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-red shrink-0" />
                <a
                  href="tel:+919582149643"
                  className="text-sm text-gray-400 hover:text-brand-red transition-colors"
                >
                  +91 9582149643
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-red shrink-0" />
                <span className="text-sm text-gray-400">info@trustedcars.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} Trusted Cars. All rights reserved. | Karol Bagh, Delhi
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-brand-red fill-brand-red" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

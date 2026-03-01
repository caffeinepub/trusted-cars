import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  Phone, Calendar, Gauge, Fuel, Settings, Users, ArrowLeft,
  CreditCard, CheckCircle, MessageSquare, Share2
} from 'lucide-react';
import { useGetCarBySlug } from '../hooks/useQueries';
import ImageGallerySlider from '../components/ImageGallerySlider';
import EnquiryModal from '../components/EnquiryModal';
import { Skeleton } from '@/components/ui/skeleton';

function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function CarDetailPage() {
  const { slug } = useParams({ from: '/public-layout/cars/$slug' });
  const navigate = useNavigate();
  const { data: car, isLoading } = useGetCarBySlug(slug);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    if (car) {
      document.title = `${car.brand} ${car.model} ${Number(car.year)} - Used Cars in Karol Bagh | Trusted Cars`;
      const metaDesc = document.querySelector('meta[name="description"]');
      const desc = `Buy ${car.brand} ${car.model} (${Number(car.year)}) in Karol Bagh, Delhi. ${Number(car.kmDriven).toLocaleString('en-IN')} km driven, ${car.fuelType}, ${car.transmission}. Price: ${formatPrice(car.price)}. Certified pre-owned car at Trusted Cars.`;
      if (metaDesc) {
        metaDesc.setAttribute('content', desc);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = desc;
        document.head.appendChild(meta);
      }
    }
    return () => {
      document.title = 'Trusted Cars - Used Cars in Karol Bagh, Delhi';
    };
  }, [car]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-brand-black mb-2">Car Not Found</h2>
          <p className="text-brand-gray-dark mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate({ to: '/cars' })}
            className="bg-brand-red text-white px-6 py-2.5 rounded font-semibold hover:bg-brand-red-dark transition-colors"
          >
            Browse All Cars
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = car.status === 'Available';

  const specs = [
    { icon: Calendar, label: 'Year', value: String(Number(car.year)) },
    { icon: Gauge, label: 'KM Driven', value: `${Number(car.kmDriven).toLocaleString('en-IN')} km` },
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
    { icon: Settings, label: 'Transmission', value: car.transmission },
    { icon: Users, label: 'Ownership', value: car.ownership },
    { icon: CheckCircle, label: 'Status', value: car.status },
  ];

  return (
    <div className="bg-brand-gray min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-gray-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate({ to: '/cars' })}
            className="flex items-center gap-2 text-sm text-brand-gray-dark hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cars
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-xl p-4 shadow-card border border-brand-gray-mid">
              <ImageGallerySlider images={car.images} alt={`${car.brand} ${car.model}`} />
            </div>

            {/* Title + Status */}
            <div className="bg-white rounded-xl p-6 shadow-card border border-brand-gray-mid">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-black">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-brand-gray-dark text-sm mt-1">{car.title}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${
                    isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-brand-red'
                  }`}>
                    {car.status}
                  </span>
                  <button className="text-brand-gray-dark hover:text-brand-red transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 p-3 bg-brand-gray rounded-lg">
                    <div className="w-8 h-8 bg-brand-red/10 rounded flex items-center justify-center shrink-0">
                      <spec.icon className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray-dark">{spec.label}</p>
                      <p className="text-sm font-semibold text-brand-black">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-xl p-6 shadow-card border border-brand-gray-mid">
                <h2 className="font-display font-bold text-lg text-brand-black mb-3">About This Car</h2>
                <p className="text-brand-gray-dark text-sm leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Finance Section */}
            <div className="bg-brand-black rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-lg">Finance Available</h2>
                  <p className="text-white/60 text-xs">Easy EMI options from top banks</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Down Payment', value: formatPrice(BigInt(Math.round(Number(car.price) * 0.2))) },
                  { label: 'Monthly EMI', value: Number(car.emi) > 0 ? `₹${Number(car.emi).toLocaleString('en-IN')}` : 'Contact Us' },
                  { label: 'Loan Tenure', value: 'Up to 7 Years' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="font-display font-bold text-white text-base">{item.value}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Price + Actions */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-card border border-brand-gray-mid sticky top-24">
              <div className="mb-4">
                <p className="text-brand-gray-dark text-sm mb-1">Selling Price</p>
                <div className="font-display font-bold text-3xl text-brand-black">
                  {formatPrice(car.price)}
                </div>
                {Number(car.emi) > 0 && (
                  <p className="text-brand-gray-dark text-sm mt-1">
                    EMI from <span className="text-brand-red font-semibold">₹{Number(car.emi).toLocaleString('en-IN')}/mo</span>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {isAvailable ? (
                  <>
                    <button
                      onClick={() => navigate({ to: '/book', search: { carId: String(Number(car.id)) } })}
                      className="w-full bg-brand-red text-white py-3 rounded font-bold text-sm hover:bg-brand-red-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Test Drive
                    </button>
                    <button
                      onClick={() => setEnquiryOpen(true)}
                      className="w-full bg-brand-black text-white py-3 rounded font-bold text-sm hover:bg-brand-black/80 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Enquire Now
                    </button>
                    <a
                      href="tel:+919582149643"
                      className="w-full border-2 border-brand-red text-brand-red py-3 rounded font-bold text-sm hover:bg-brand-red hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now: 9582149643
                    </a>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-brand-red font-semibold text-sm">This car has been sold</p>
                      <p className="text-brand-gray-dark text-xs mt-1">Check our other available cars</p>
                    </div>
                    <button
                      onClick={() => navigate({ to: '/cars' })}
                      className="w-full bg-brand-black text-white py-3 rounded font-bold text-sm hover:bg-brand-black/80 transition-colors"
                    >
                      Browse Similar Cars
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-4 pt-4 border-t border-brand-gray-mid">
                <p className="text-xs text-brand-gray-dark text-center">
                  Questions? Call us at{' '}
                  <a href="tel:+919582149643" className="text-brand-red font-semibold">
                    +91 9582149643
                  </a>
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-xl p-4 shadow-card border border-brand-gray-mid">
              <h3 className="font-semibold text-brand-black text-sm mb-3">Why Buy From Us?</h3>
              <ul className="space-y-2">
                {[
                  'RC Transfer Assistance',
                  'Insurance Transfer Help',
                  'Loan Processing Support',
                  '7-Day Return Policy',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-brand-gray-dark">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        carTitle={`${car.brand} ${car.model} (${Number(car.year)})`}
      />
    </div>
  );
}

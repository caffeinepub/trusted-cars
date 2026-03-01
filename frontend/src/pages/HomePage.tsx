import { useNavigate } from '@tanstack/react-router';
import { Shield, CheckCircle, CreditCard, Tag, Star, ChevronRight, Phone } from 'lucide-react';
import { useGetFeaturedCars } from '../hooks/useQueries';
import CarCard from '../components/CarCard';
import { Skeleton } from '@/components/ui/skeleton';

const WHY_CHOOSE_US = [
  {
    icon: Shield,
    title: 'Quality Check',
    desc: 'Every car undergoes a rigorous 150-point inspection before listing.',
  },
  {
    icon: CheckCircle,
    title: 'Verified Cars',
    desc: 'All vehicles are verified for ownership, RC, and insurance documents.',
  },
  {
    icon: CreditCard,
    title: 'Easy Finance',
    desc: 'Get instant loan approvals with low interest rates from top banks.',
  },
  {
    icon: Tag,
    title: 'Transparent Pricing',
    desc: 'No hidden charges. What you see is what you pay — always.',
  },
];

const REVIEWS = [
  {
    name: 'Rahul Sharma',
    location: 'Delhi',
    rating: 5,
    text: 'Bought a Honda City from Trusted Cars. The process was smooth, transparent, and the car was in excellent condition. Highly recommended!',
  },
  {
    name: 'Priya Mehta',
    location: 'Gurgaon',
    rating: 5,
    text: 'Great experience! The team helped me find the perfect car within my budget. Finance was arranged quickly. Very professional service.',
  },
  {
    name: 'Amit Kumar',
    location: 'Noida',
    rating: 5,
    text: 'Trusted Cars lives up to its name. All documents were clear, pricing was fair, and the test drive was arranged the same day. 5 stars!',
  },
  {
    name: 'Sunita Verma',
    location: 'Karol Bagh',
    rating: 5,
    text: 'Excellent service and genuine cars. I got a great deal on a Maruti Swift. The staff was very helpful and honest throughout.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: featuredCars, isLoading } = useGetFeaturedCars();

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1440x700.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-brand-black/65" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
            Karol Bagh's Most Trusted Car Dealer
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
            Buy Trusted Pre-Owned Cars{' '}
            <span className="text-brand-red">in Karol Bagh</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-8 font-light tracking-wide">
            Certified &bull; Verified &bull; Transparent Pricing
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: '/cars' })}
              className="bg-brand-red text-white px-8 py-3.5 rounded font-semibold text-base hover:bg-brand-red-dark transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              View Cars
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate({ to: '/book' })}
              className="bg-white text-brand-black px-8 py-3.5 rounded font-semibold text-base hover:bg-brand-gray transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              Book Test Drive
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '500+', label: 'Cars Sold' },
              { value: '10+', label: 'Years Experience' },
              { value: '4.9★', label: 'Customer Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-2">Our Inventory</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black">Featured Cars</h2>
          </div>
          <button
            onClick={() => navigate({ to: '/cars' })}
            className="hidden sm:flex items-center gap-1.5 text-brand-red font-semibold text-sm hover:gap-3 transition-all"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-brand-gray-mid">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredCars && featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={Number(car.id)} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-gray rounded-xl">
            <p className="text-brand-gray-dark text-lg mb-2">No featured cars yet</p>
            <p className="text-brand-gray-dark text-sm">Check back soon for our latest inventory.</p>
            <button
              onClick={() => navigate({ to: '/cars' })}
              className="mt-4 bg-brand-red text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-brand-red-dark transition-colors"
            >
              Browse All Cars
            </button>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={() => navigate({ to: '/cars' })}
            className="inline-flex items-center gap-2 text-brand-red font-semibold text-sm"
          >
            View All Cars <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-2">Why Us</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">Why Choose Trusted Cars?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-200 group"
              >
                <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-red transition-colors duration-200">
                  <item.icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-red text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="bg-white border border-brand-gray-mid rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-brand-gray-dark text-sm leading-relaxed mb-4 line-clamp-3">"{review.text}"</p>
              <div>
                <p className="font-semibold text-brand-black text-sm">{review.name}</p>
                <p className="text-brand-gray-dark text-xs">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-brand-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-white/80 text-base mb-8">
            Visit us at Karol Bagh or call us now to book a test drive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: '/cars' })}
              className="bg-white text-brand-red px-8 py-3.5 rounded font-bold text-base hover:bg-brand-gray transition-colors"
            >
              Browse Cars
            </button>
            <a
              href="tel:+919582149643"
              className="flex items-center justify-center gap-2 bg-brand-black text-white px-8 py-3.5 rounded font-bold text-base hover:bg-brand-black/80 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now: 9582149643
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
